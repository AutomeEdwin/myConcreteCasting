from .views import RegisterAPI, LoginAPI, JobsitesAPI
from knox import views as knox_views
from django.urls import path

urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('jobsites/', JobsitesAPI.as_view(), name="jobsite"),
]
