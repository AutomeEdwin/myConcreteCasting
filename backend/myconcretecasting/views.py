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
            resistanceEvolution = getResistanceEvolution(
                casting["casting_fcm2_fcm28_ratio"], casting["casting_type2_addition"], casting["casting_rc2_rc28_ratio"], casting["casting_cement_type"])
            envConditions = getEnvConditions(
                weather['clouds']['all'], weather['wind']['speed'], weather['main']['humidity'])

            curingDurationDays = getCuringTime(
                resistanceEvolution, envConditions, weather['main']['temp'])
            endCuringDate = datetime.datetime.now() + datetime.timedelta(days=curingDurationDays)

            casting['casting_curing_end'] = endCuringDate
            casting['casting_curing_start'] = datetime.datetime.now()
            jobsite.jobsite_castings[data['casting_index']] = casting
            jobsite.save()

            return Response({"startCuringDate": datetime.datetime.now(), "endCuringDate": endCuringDate}, status=status.HTTP_200_OK)
