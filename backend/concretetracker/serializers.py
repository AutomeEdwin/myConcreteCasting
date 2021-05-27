from rest_framework import serializers
from concretetracker.models import User


class ConcretetrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'firstName', 'lastName', 'email', 'password')
