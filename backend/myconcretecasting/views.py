from django.contrib.auth import login
from knox.views import LoginView as KnoxLoginView
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework import permissions
from django.shortcuts import render
from rest_framework import status


from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer, JobsiteSerializer

from django.http import JsonResponse
from rest_framework.views import APIView

from .models import Jobsite

from rest_framework.parsers import JSONParser


import json

# Register API


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "success": True,
            "message": "User created sucessfully",
            # "user": UserSerializer(user, context=self.get_serializer_context()).data,
            # "token": AuthToken.objects.create(user)[1]
        })

# Login API


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)


class JobsitesAPI(APIView):

    def post(self, request, format=None):
        data = JSONParser().parse(request)
        serializer = JobsiteSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, *args, **kwargs):
        jobsistes = Jobsite.objects.filter(
            jobsite_owner=kwargs['jobsite_owner'])
        serializer = JobsiteSerializer(jobsistes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
