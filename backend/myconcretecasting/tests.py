from rest_framework.test import APITestCase
from rest_framework import status

from .models import User
from .serializers import UserSerializer


class RegistrationTestCase(APITestCase):
    def test_registration(self):
        data = {"first_name": "John",
                "last_name": "Doe",
                "email": "johnDoe@gmail.com",
                "password": "123456789"}
        response = self.client.post('/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class LoginTest(APITestCase):
