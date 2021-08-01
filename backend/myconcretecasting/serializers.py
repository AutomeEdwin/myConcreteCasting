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
        fields = ['id', 'owner_id', 'jobsite_name', 'jobsite_address',
                  'jobsite_coordinates', 'jobsite_description', 'jobsite_castings']


class CastingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Casting
        fields = ['id', 'casting_name', 'casting_description', 'casting_fcm2_fcm28_ratio',
                  'casting_type2_addition', 'casting_rc2_rc28_ratio', 'casting_cement_type']
