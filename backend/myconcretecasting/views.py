from django.contrib.auth import authenticate, login
from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from .serializers import UserSerializer, RegisterSerializer, JobsiteSerializer, CastingSerializer
from .models import Jobsite, User

import datetime
import requests


class Register(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        """
        Check if the user provides the correct credentials
        and if the user doesn't already exist.

        Create a new user if credentials are correct and user doesn't exists
        """
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "status": status.HTTP_201_CREATED,
            "message": "User created sucessfully"
        }, status=status.HTTP_201_CREATED)


class Login(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        """
        Check if the user provides the correct credentials.
        if they are correct a token is generated for the user
        and send in the response with his username(email) and user_id
        """
        data = JSONParser().parse(request)

        user = authenticate(
            username=data['email'], password=data["password"])

        if user is not None:
            token = Token.objects.create(user=user)
            serialized_user = UserSerializer(user)
            return Response({"token": token.key,
                             "user": serialized_user.data
                             }, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Email or password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)


class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        t = Token.objects.get(
            key=request.headers['Authorization'].replace('Token ', ""))
        t.delete()
        return Response({"status": status.HTTP_200_OK}, status=status.HTTP_200_OK)


class DeleteUser(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, *args, **kwargs):

        User.objects.get(id=kwargs['user_id']).delete()
        return Response({"status": status.HTTP_200_OK}, status=status.HTTP_200_OK)

        return Response({"message": "Email or password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)


class UpdateUser(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = User.objects.get(id=kwargs['user_id'])
        data = JSONParser().parse(request)
        serializer = UserSerializer(user, data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserPassword(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        data = JSONParser().parse(request)

        username = User.objects.get(id=kwargs['user_id']).email

        user = authenticate(
            username=username, password=data['currentPassword'])

        if user is not None:
            if data['newPassword'] == data['newPasswordConfirm']:
                user.set_password(data['newPassword'])
                user.save()
                return Response({"message": "user password has been successfully changed"}, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class Jobsites(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        data = JSONParser().parse(request)
        serializer = JobsiteSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, *args, **kwargs):
        jobsistes = Jobsite.objects.filter(
            owner_id=kwargs['owner_id'])
        serializer = JobsiteSerializer(jobsistes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class getJobsiteByID(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, *args, **kwargs):
        jobsite = Jobsite.objects.get(id=kwargs['id'],
                                      owner_id=kwargs['owner_id'])
        serializer = JobsiteSerializer(jobsite)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, *args, **kwargs):
        jobsite = Jobsite.objects.get(
            id=kwargs['id'], owner_id=kwargs['owner_id'])
        jobsite.delete()
        return Response({"status": status.HTTP_200_OK}, status=status.HTTP_200_OK)


class getJobsiteWeather(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = JSONParser().parse(request)
        r = requests.get(
            "http://api.openweathermap.org/data/2.5/weather?lat=" + str(data["lat"]) + "&lon="+str(data["lon"])+"&units=metric&appid=1741bc771947d46a2aac130e41db45cf").json()

        weather = {
            'description': r['weather'][0]['description'],
            'icon': r['weather'][0]['icon'],
            'temperature': r['main']['temp'],
            'humidity': r['main']['humidity'],
            'cloudsPercentage': r['clouds']['all'],
            'windSpeed': r['wind']['speed']
        }
        return Response(weather, status=status.HTTP_200_OK)


class calculateCuringTime(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = JSONParser().parse(request)

        jobsite = Jobsite.objects.get(id=data['jobsite_id'])
        casting = CastingSerializer(
            jobsite.jobsite_castings[data['casting_index']])
        casting = casting.data
        weather = requests.get("http://api.openweathermap.org/data/2.5/weather?lat=" + str(jobsite.jobsite_coordinates[0]) + "&lon="+str(
            jobsite.jobsite_coordinates[1])+"&units=metric&appid=1741bc771947d46a2aac130e41db45cf").json()

        if casting['casting_isClassEI']:
            endCuringDate = datetime.datetime.now() + datetime.timedelta(hours=12)

            casting['casting_curing_end'] = endCuringDate
            casting['casting_curing_start'] = datetime.datetime.now()
            jobsite.jobsite_castings[data['casting_index']] = casting
            jobsite.save()

            return Response({"startCuringDate": datetime.datetime.now(), "endCuringDate": endCuringDate}, status=status.HTTP_200_OK)

        else:
            resistanceEvolution = self.getResistanceEvolution(
                casting["casting_fcm2_fcm28_ratio"], casting["casting_type2_addition"], casting["casting_rc2_rc28_ratio"], casting["casting_cement_type"])
            envConditions = self.getEnvConditions(
                weather['clouds']['all'], weather['wind']['speed'], weather['main']['humidity'])

            curingDurationDays = self.getCuringTime(
                resistanceEvolution, envConditions, weather['main']['temp'])
            endCuringDate = datetime.datetime.now() + datetime.timedelta(days=curingDurationDays)

            casting['casting_curing_end'] = endCuringDate
            casting['casting_curing_start'] = datetime.datetime.now()
            jobsite.jobsite_castings[data['casting_index']] = casting
            jobsite.save()

            return Response({"curingDurationDays": curingDurationDays, "endCuringDate": endCuringDate.strftime("%c")}, status=status.HTTP_200_OK)

    def getCuringTime(self, resistanceEvolution, envConditions, concrete_temperature):
        if resistanceEvolution == "fast" and envConditions == "good" and concrete_temperature >= 10:
            return 1
        elif (resistanceEvolution == "fast" and envConditions == "good" and concrete_temperature < 10) or (resistanceEvolution == "fast" and envConditions == "normal" and concrete_temperature >= 10) or (resistanceEvolution == "average" and envConditions == "good" and concrete_temperature >= 10):
            return 2
        elif (resistanceEvolution == "fast" and envConditions == "bad" and concrete_temperature >= 10) or (resistanceEvolution == "average" and envConditions == "normal" and concrete_temperature >= 10) or (resistanceEvolution == "slow" and envConditions == "good" and concrete_temperature >= 10):
            return 3
        elif (resistanceEvolution == "fast" and envConditions == "normal" and concrete_temperature < 10) or (resistanceEvolution == "average" and envConditions == "good" and concrete_temperature < 10) or (resistanceEvolution == "average" and envConditions == "bad" and concrete_temperature >= 10) or (resistanceEvolution == "slow" and envConditions == "normal" and concrete_temperature >= 10) or (resistanceEvolution == "very slow" and envConditions == "good" and concrete_temperature >= 10):
            return 4
        elif (resistanceEvolution == "fast" and envConditions == "bad" and concrete_temperature < 10) or (resistanceEvolution == "slow" and envConditions == "good" and concrete_temperature < 10):
            return 5
        elif (resistanceEvolution == "average" and envConditions == "normal" and concrete_temperature < 10) or (resistanceEvolution == "very slow" and envConditions == "good" and concrete_temperature < 10) or (resistanceEvolution == "very slow" and envConditions == "normal" and concrete_temperature >= 10):
            return 6
        elif (resistanceEvolution == "slow" and envConditions == "bad" and concrete_temperature >= 10):
            return 7
        elif (resistanceEvolution == "average" and envConditions == "bad" and concrete_temperature < 10) or (resistanceEvolution == "slow" and envConditions == "normal" and concrete_temperature < 10):
            return 8
        elif (resistanceEvolution == "slow" and envConditions == "bad" and concrete_temperature < 10) or (resistanceEvolution == "very slow" and envConditions == "bad" and concrete_temperature >= 10):
            return 10
        elif (resistanceEvolution == "very slow" and envConditions == "normal" and concrete_temperature < 10):
            return 12
        elif (resistanceEvolution == "very slow" and envConditions == "bad" and concrete_temperature < 10):
            return 15

    def getResistanceEvolution(self, fcm2_fcm28_ratio, type2_addition, rc2_rc28_ratio, cement_type):
        if fcm2_fcm28_ratio is not None:
            return self.ratio(fcm2_fcm28_ratio)
        elif type2_addition:
            return "very slow"
        elif rc2_rc28_ratio is not None:
            return self.ratio(rc2_rc28_ratio)
        elif cement_type is not None:
            return self.cementType(cement_type)
        else:
            return ("very slow")

    def getEnvConditions(self, clouds, wind, humidity):
        if humidity < 50 or clouds < 25 or wind > 5:
            return 'bad'
        elif 50 <= humidity < 80 or 25 <= clouds < 75:
            return "normal"
        elif humidity >= 80 and clouds > 75 and wind < 5:
            return 'good'

    def ratio(self, ratio):
        # Determines the evolution of the strength according to the ratio Fcm2/Fcm28 of the concrete or Rc2/Rc25 of the cement
        if 0 > ratio >= 0.5:
            return "fast"
        elif 0.3 <= ratio < 0.5:
            return "average"
        elif 0.15 <= ratio < 0.3:
            return "slow"
        elif ratio < 0.15:
            return "very slow"

    def cementType(self, type):
        # Determines the evolution of the strength according to the type of cement
        cementTypes = {
            # CEM 1
            "CEM 1 52.5 N ou R": "fast",
            "CEM 1 42.5 N ou R": "average",
            # CEM 2
            "CEM 2/A-M ou -V 42.5 N ou R ou 32.5 R": "average",
            "CEM 2/A-S, -D ou -LL 52.5 N ou R": "fast",
            "CEM 2/A-S, -D ou -LL 42.5 N ou R": "fast",
            "CEM 2/A-S, -D OU -LL 32.5 R": "average",
            "CEM 2/A-S, -D, -LL, -M ou -V 32.5 N": "slow",
            "CEM 2/B-S, -LL, -M ou -V 42.5 N ou R ou 32.5 R": "average",
            "CEM 2/B-S, -LL, -M ou -V 32.5 N": "slow",
            # CEM 3
            "CEM 3/A 52.5 N ou 42.5 N": "average",
            "CEM 3/A 32.5 N": "slow",
            "CEM 3/B 42.5 N ou 32.5 N": "slow",
            "CEM 3/C 32.5 N": "slow",
            # CEM 5
            "CEM 5/A 32.5 N": "slow",
            # OTHER
            "oversulfated cement": "very slow",

        }
        return cementTypes[type]
