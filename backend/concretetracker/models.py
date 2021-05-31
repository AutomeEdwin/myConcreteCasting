"""test"""
from django.db import models


class User(models.Model):
    """test"""
    firstName = models.CharField(max_length=20, blank=False, default='')
    lastName = models.CharField(max_length=20, blank=False, default='')
    email = models.CharField(max_length=50, blank=False, default='')
    password = models.CharField(max_length=32, blank=False, default='')
