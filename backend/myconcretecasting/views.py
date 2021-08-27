from django.contrib.auth import authenticate, login
from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from .serializers import UserSerializer, RegisterSerializer, JobsiteSerializer, CastingSerializer
from .models import Jobsite, User
from .calculations import *
from .concrete_hardening import StrengthClass, CementType, ConcreteStrength


import datetime
import requests
import environ

env = environ.Env()
environ.Env.read_env()


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
            return Response(serializer.data, status=status.HTTP_200_OK)

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
                                      owner=kwargs['owner_id'])
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
            "http://api.openweathermap.org/data/2.5/weather?lat=" + str(data["lon"]) + "&lon="+str(data["lat"])+"&units=metric&appid=" + str(env("OPENWEATHER_KEY"))).json()

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

    def getWeatherDatas(self, jobsite):
        today = datetime.datetime.today().replace(
            hour=10, minute=00, second=00, microsecond=00)
        temperatures = {}  # day_timestamp: avg_temp
        humidities = {}
        winds = {}

        # Getting historical and current weather datas
        # iterate from 5 days ago until today
        for i in range(5, 0, -1):
            averageTemp, averageHumidity, averageWinds = 0, 0, 0
            timestamp = today - datetime.timedelta(days=i)
            previousWeather = requests.get("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + str(jobsite.coordinates[0])+"&lon="+str(
                jobsite.coordinates[1])+"&dt="+str(int(timestamp.timestamp()))+"&units=metric&appid=" + str(env("OPENWEATHER_KEY"))).json()

            for hour in previousWeather["hourly"]:
                averageTemp += round(hour["temp"], 2)
                averageHumidity += hour["humidity"]
                averageWinds += hour["wind_speed"]

            averageTemp = round(averageTemp/len(previousWeather["hourly"]), 2)
            averageHumidity = round(
                averageHumidity/len(previousWeather["hourly"]), 2)
            averageWinds = round(
                averageWinds/len(previousWeather["hourly"]), 2)

            temperatures[str(int(timestamp.timestamp()))] = averageTemp
            humidities[str(int(timestamp.timestamp()))] = averageHumidity
            winds[str(int(timestamp.timestamp()))] = averageWinds

        # Getting futur weather datas
        futurWeather = requests.get("https://api.openweathermap.org/data/2.5/onecall?lat=" + str(jobsite.coordinates[1])+"&lon="+str(
            jobsite.coordinates[0])+"&exclude=current,minutely,hourly,alerts&units=metric&appid=" + str(env("OPENWEATHER_KEY"))).json()

        for day in futurWeather["daily"]:
            temperatures[str(int(day["dt"]))] = round(
                (day["temp"]["min"] + day["temp"]["max"])/2, 2)
            humidities[str(int(day["dt"]))] = day["humidity"]
            winds[str(int(day["dt"]))] = day["wind_speed"]

        return temperatures, humidities, winds

    def post(self, request):
        data = JSONParser().parse(request)

        jobsite = Jobsite.objects.get(id=data['jobsite_id'])
        casting = CastingSerializer(jobsite.castings[data['casting_index']])
        casting = casting.data

        casting["casting_start"] = data["startingDate"]

        temp, humidity, winds = self.getWeatherDatas(jobsite)

        strengthClass = casting['strength_class']
        cementType = casting['cement_type']
        if cementType == "CEM 42.5 R" or cementType == "CEM 52.5 N" or cementType == "CEM 52.5 R":
            cementType = "R"
        elif cementType == "CEM 32.5 R" or cementType == "CEM 42.5 N":
            cementType = "N"
        elif cementType == "CEM 32.5 N":
            cementType = "S"

        hardening = ConcreteStrength(
            StrengthClass[strengthClass], CementType[cementType])
        hardening.setTempHistory(list(temp.keys()), list(temp.values()))
        hardening.setCastingTime(casting["casting_start"])
        hardening.computeMaturity()

        t = hardening.getTimeStrength(data["targetStrength"])
        unCastLeft = t.x[0] / 1000

        casting["hardening_duration"] = unCastLeft

        if casting['isClassEI']:
            casting["casting_start"] = data["startingDate"]

            curingDurationDays = 43200

            endCuringDate = datetime.datetime.fromtimestamp(
                data["startingDate"]) + datetime.timedelta(hours=12)
            remainingCuringTime = endCuringDate - datetime.datetime.now()

            # 43200 seconds = 12 hours
            casting["curing_duration"] = curingDurationDays
            jobsite.castings[data['casting_index']] = casting
            jobsite.save()

            return Response({"startCuringDate": data["startingDate"], "curingDuration": int(curingDurationDays), "hardening_duration": unCastLeft}, status=status.HTTP_200_OK)
        else:
            casting["casting_start"] = data["startingDate"]

            resistanceEvolution = getResistanceEvolution(
                casting["fcm2_fcm28_ratio"], casting["type2_addition"], casting["rc2_rc28_ratio"], casting["cement_type"])
            envConditions = getEnvConditions(
                sum(winds.values())/len(humidity), sum(humidity.values())/len(humidity))
            curingDurationDays = getCuringTime(
                resistanceEvolution, envConditions, sum(temp.values())/len(temp))
            endingCuringDate = datetime.datetime.fromtimestamp(
                data["startingDate"]) + datetime.timedelta(days=curingDurationDays)

            # converting days in seconds
            casting["curing_duration"] = int(curingDurationDays * 24 * 60 * 60)
            jobsite.castings[data['casting_index']] = casting
            jobsite.save()

            return Response({"startCuringDate": data["startingDate"], "curingDuration": int(curingDurationDays * 24 * 60 * 60), "hardening_duration": unCastLeft}, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)
