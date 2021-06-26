from django.contrib.auth import login
from knox.views import LoginView as KnoxLoginView
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework import permissions
from django.shortcuts import render

from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer

from django.http import JsonResponse
from django.views import View

from .models import Jobsite

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


class JobsitesAPI(View):

    def post(self, request, *args, **kwargs):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        jobsite = Jobsite(jobsite_owner=body['jobsite_owner'], jobsite_name=body['jobsite_name'],
                          jobsite_address=body['jobsite_address'],
                          jobsite_coordinates=body['jobsite_coordinates'],
                          jobsite_description=body['jobsite_description'],
                          #jobsite_castings=body['jobsite_castings']
                          )
        jobsite.save()

        return JsonResponse({
            'message': 'post',
        })

    def get(self, request):

        return JsonResponse({
            'message': 'get',
        })
