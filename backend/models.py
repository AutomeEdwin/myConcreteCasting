# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class ConcretetrackerUser(models.Model):
    email = models.CharField()
    firstname = models.CharField(db_column='firstName')  # Field name made lowercase.
    id = models.TextField(primary_key=True)  # This field type is a guess.
    lastname = models.CharField(db_column='lastName')  # Field name made lowercase.
    password = models.CharField()

    class Meta:
        managed = False
        db_table = 'concretetracker_user'


class DjangoMigrations(models.Model):
    app = models.CharField()
    applied = models.DateTimeField()
    id = models.TextField(primary_key=True)  # This field type is a guess.
    name = models.CharField()

    class Meta:
        managed = False
        db_table = 'django_migrations'
