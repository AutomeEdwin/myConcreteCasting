from rest_framework import generics, permissions, viewsets

from django.http import JsonResponse

from django.contrib.auth import authenticate, login

from .serializers import UserSerializer, RegisterSerializer, JobsiteSerializer
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.authtoken.models import Token
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework import status


from .models import Jobsite


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


class Login(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = JSONParser().parse(request)
        user = authenticate(
            username=data['email'], password=data["password"])

        if user is not None:
            token = Token.objects.create(user=user)

            return Response({"token": token.key,
                             "user": user.email,
                             "user_id": user.id}, status=status.HTTP_200_OK)

        else:
            return Response({"message": "Email or password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)


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
