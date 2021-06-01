"""test"""
from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from concretetracker.models import User
from concretetracker.serializers import ConcretetrackerSerializer
from rest_framework.decorators import api_view


@api_view(['POST'])
def signup(request):
    """test"""
    data = JSONParser().parse(request)

    if 'firstName' not in data or 'lastName' not in data or 'email' not in data or 'password' not in data:
        return JsonResponse({'success': False, 'message': 'All fields required'}, status=status.HTTP_412_PRECONDITION_FAILED)

    new_user = User.objects.all().filter(email__exact=data.get("email"))
    if new_user.exists():
        return JsonResponse({'success': False, 'message': 'This user already exists'}, status=status.HTTP_412_PRECONDITION_FAILED)

    if len(data.get('password')) < 8:
        return JsonResponse({'success': False, 'message': 'This password is too small'}, status=status.HTTP_412_PRECONDITION_FAILED)

    data_serializer = ConcretetrackerSerializer(data=data)
    if data_serializer.is_valid():
        data_serializer.save()
        return JsonResponse({'success': True, 'message': 'Account created'}, status=status.HTTP_201_CREATED)

    return JsonResponse({'success': False, 'message': 'An error has occured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST', 'GET'])
def signin(request):
    """test"""
    request_body = JSONParser().parse(request)

    if 'email' not in request_body or 'password' not in request_body:
        return JsonResponse({'success': False, 'message': 'All fields required'}, status=status.HTTP_412_PRECONDITION_FAILED)

    user = User.objects.all().filter(email__exact=request_body.get("email"))

    if not user.exists() or (request_body.get('password') != user.values()[0]['password']):
        return JsonResponse({'success': False, 'message': 'Authentification failed'}, status=status.HTTP_412_PRECONDITION_FAILED)

    return JsonResponse({'success': True, 'message': 'Authentification successful', 'token': 'JWT token'}, status=status.HTTP_200_OK)
