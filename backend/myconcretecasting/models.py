from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from django.db import models

from djongo import models

from .managers import UserManager


class User(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class Casting(models.Model):
    casting_name = models.CharField(max_length=50)
    casting_description = models.TextField()
    casting_infos = models.TextField()

    class Meta:
        abstract = True


class Jobsite(models.Model):

    owner_id = models.ForeignKey(User, on_delete=models.CASCADE)
    jobsite_name = models.CharField(max_length=255)
    jobsite_address = models.CharField(max_length=255)
    jobsite_coordinates = models.JSONField()
    jobsite_description = models.TextField()
    jobsite_castings = models.ArrayField(
        model_container=Casting
    )
