from django.test import TestCase
from django.test import Client

# Create your tests here.


class RegisterTest(TestCase):
    def testRegistration(self):
        c = Client()
        response = c.post('/register/',
                          {
                              "first_name": "John",
                              "last_name": "Doe",
                              "email": "johnDoe@gmail.com",
                              "password": "123456789"
                          }
                          )
        self.assertEqual(response.status_code, 201)

        response = c.post('/register/',
                          {
                              "first_name": "John",
                              "last_name": "Doe",
                              "email": "johnDoe.com",
                          }
                          )
        self.assertEqual(response.status_code, 400)

