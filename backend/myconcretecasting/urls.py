from .views import RegisterAPI, Login, JobsitesAPI
from django.urls import path

urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('login/', Login.as_view(), name='login'),
    path('jobsites/', JobsitesAPI.as_view(), name="jobsite"),
    path('jobsites/<jobsite_owner>', JobsitesAPI.as_view(), name="jobsite"),

]
