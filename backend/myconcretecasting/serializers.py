from rest_framework import serializers
from .models import User, Jobsite, Casting


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name',)
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['email'], validated_data['password'], validated_data['first_name'], validated_data['last_name'])

        return user


class JobsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobsite
        fields = ['id', 'owner', 'name', 'address',
                  'coordinates', 'description', 'castings']


class CastingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Casting
        fields = ['id', 'name', 'description', 'isClassEI', 'fcm2_fcm28_ratio',
                  'type2_addition', 'rc2_rc28_ratio', 'cement_type', 'strength_class',
                  'curing_start', 'curing_end']
