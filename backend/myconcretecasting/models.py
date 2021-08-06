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
    casting_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    casting_name = models.CharField(max_length=50)
    casting_description = models.TextField(blank=True)
    casting_isClassEI = models.BooleanField()
    casting_fcm2_fcm28_ratio = models.IntegerField(null=True)
    casting_type2_addition = models.BooleanField()
    casting_rc2_rc28_ratio = models.IntegerField(null=True)
    casting_cement_type = models.CharField(max_length=50)
    casting_curing_start = models.DateTimeField(default=None, null=True)
    casting_curing_end = models.DateTimeField(default=None, null=True)


class Jobsite(models.Model):

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    jobsite_name = models.CharField(max_length=255)
    jobsite_address = models.CharField(max_length=255)
    jobsite_coordinates = models.JSONField()
    jobsite_description = models.TextField(blank=True)
    jobsite_castings = models.ArrayField(
        model_container=Casting
    )
