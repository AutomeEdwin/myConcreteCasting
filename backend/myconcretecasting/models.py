from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from django.db import models

from djongo import models

from .managers import UserManager

import uuid


class User(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class Casting(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    isClassEI = models.BooleanField()
    fcm2_fcm28_ratio = models.IntegerField(null=True)
    type2_addition = models.BooleanField()
    rc2_rc28_ratio = models.IntegerField(null=True)
    cement_type = models.CharField(max_length=15)
    strength_class = models.CharField(max_length=10)
    curing_start = models.DateTimeField(default=None, null=True)
    curing_end = models.DateTimeField(default=None, null=True)


class Jobsite(models.Model):

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    coordinates = models.JSONField()
    description = models.TextField(blank=True)
    castings = models.ArrayField(
        model_container=Casting
    )
