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

        return Response(status=status.HTTP_400_BAD_REQUEST)

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


class calculateCuringTime(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        casting = JSONParser().parse(request)

        if casting['is_indoor']:
            endCuringDate = datetime.datetime.now() + datetime.timedelta(hours=12)
            return Response({"curingDurationDays": 0.5, "endCuringDate": endCuringDate.strftime("%c")}, status=status.HTTP_200_OK)

        else:
            resistanceEvolution = self.getResistanceEvolution(
                casting["fcm2_fcm28_ratio"], casting["type2_addition"], casting["rc2_rc28_ratio"], casting["cement_type"])
            envConditions = self.getEnvConditions(
                casting["clouds"], casting["wind"], casting["humidity"])

            curingDurationDays = self.getCuringTime(
                resistanceEvolution, envConditions, casting["temp"])
            endCuringDate = datetime.datetime.now() + datetime.timedelta(days=curingDurationDays)

            return Response({"curingDurationDays": curingDurationDays, "endCuringDate": endCuringDate.strftime("%c")}, status=status.HTTP_200_OK)

    def getCuringTime(self, resistanceEvolution, envConditions, concrete_temperature):
        if resistanceEvolution == "fast":
            if envConditions == "good":
                if concrete_temperature >= 10:
                    return 1
                elif concrete_temperature < 10:
                    return 2
            elif envConditions == "normal":
                if concrete_temperature >= 10:
                    return 2
                elif concrete_temperature < 10:
                    return 4
            elif envConditions == "bad":
                if concrete_temperature >= 10:
                    return 3
                elif concrete_temperature < 10:
                    return 5
        elif resistanceEvolution == "average":
            if envConditions == "good":
                if concrete_temperature >= 10:
                    return 2
                elif concrete_temperature < 10:
                    return 4
            elif envConditions == "normal":
                if concrete_temperature >= 10:
                    return 3
                elif concrete_temperature < 10:
                    return 6
            elif envConditions == "bad":
                if concrete_temperature >= 10:
                    return 4
                elif concrete_temperature < 10:
                    return 8
        elif resistanceEvolution == "slow":
            if envConditions == "good":
                if concrete_temperature >= 10:
                    return 3
                elif concrete_temperature < 10:
                    return 5
            elif envConditions == "normal":
                if concrete_temperature >= 10:
                    return 4
                elif concrete_temperature < 10:
                    return 8
            elif envConditions == "bad":
                if concrete_temperature >= 10:
                    return 7
                elif concrete_temperature < 10:
                    return 10
        elif resistanceEvolution == "very slow":
            if envConditions == "good":
                if concrete_temperature >= 10:
                    return 4
                elif concrete_temperature < 10:
                    return 6
            elif envConditions == "normal":
                if concrete_temperature >= 10:
                    return 6
                elif concrete_temperature < 10:
                    return 12
            elif envConditions == "bad":
                if concrete_temperature >= 10:
                    return 10
                elif concrete_temperature < 10:
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
            "oversulfated cement": "very slow",
            # CEM 1
            "CEM 1 52.5 N": "fast",
            "CEM 1 52.5 R": "fast",
            "CEM 1 42.5 N": "average",
            "CEM 1 42.5 R": "average",
            # CEM 2
            # TODO
            # CEM 3
            "CEM 3/A 52.5 N": "average",
            "CEM 3/A 42.5 N": "average",
            "CEM 3/A 32.5 N": "slow",
            "CEM 3/B 42.5 N": "slow",
            "CEM 3/B 32.5 N": "slow",
            "CEM 3/C 32.5 N": "slow",
            # CEM 5
            "CEM 5/A 32.5 N": "slow"
        }
        return cementTypes[type]
