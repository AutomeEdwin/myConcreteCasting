from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from django.db import models

from .managers import UserManager


class User(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class Jobsite(models.Model):
    class Meta:
        db_table: "Jobsites"

    jobsite_owner = models.CharField(max_length=50)
    jobsite_name = models.CharField(max_length=255)
    jobsite_address = models.CharField(max_length=255)
    jobsite_coordinates = models.CharField(max_length=50)
    jobsite_description = models.TextField()
    jobsite_castings = models.TextField()
