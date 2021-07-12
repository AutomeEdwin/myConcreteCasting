from django.contrib.auth import authenticate, login
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from .serializers import UserSerializer, RegisterSerializer, JobsiteSerializer
from .models import Jobsite


class Register(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        """
        Check if the user provides the correct credentials 
        and if the user doesn't already exist.

        Create a new user if credentials are correct and user doesn't exists
        """
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "status": status.HTTP_400_BAD_REQUEST,
                "message": "User already exist"
            }, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        return Response({
            "status": status.HTTP_201_CREATED,
            "message": "User created sucessfully"
        }, status=status.HTTP_201_CREATED)


class Login(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
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

            return Response({"status": status.HTTP_200_OK,
                             "token": token.key,
                             "user": user.email,
                             "user_id": user.id}, status=status.HTTP_200_OK)

        else:
            return Response({"message": "Email or password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)


class Jobsites(APIView):

    def post(self, request, format=None):
        data = JSONParser().parse(request)
        serializer = JobsiteSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, *args, **kwargs):
        jobsistes = Jobsite.objects.filter(
            jobsite_owner=kwargs['jobsite_owner'])
        serializer = JobsiteSerializer(jobsistes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
