from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from concretetracker.models import User
from concretetracker.serializers import ConcretetrackerSerializer
from rest_framework.decorators import api_view


@api_view(['POST'])
def signup(request):
    data = JSONParser().parse(request)
    data_serializer = ConcretetrackerSerializer(data=data)
    if data_serializer.is_valid():
        data_serializer.save()
        return JsonResponse(data_serializer.data, status=status.HTTP_201_CREATED)
    return JsonResponse(data_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
