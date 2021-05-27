from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from concretetracker.models import User
from concretetracker.serializers import ConcretetrackerSerializer
from rest_framework.decorators import api_view


@api_view(['POST'])
def signup(request):
    return ''
