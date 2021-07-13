from .views import Register, Login, Logout, Jobsites
from django.urls import path

urlpatterns = [
    path('register/', Register.as_view(), name='register'),
    path('login/', Login.as_view(), name='login'),
    path('logout/', Logout.as_view(), name='logout'),
    path('jobsites/', Jobsites.as_view(), name="jobsite"),
    path('jobsites/<jobsite_owner>', Jobsites.as_view(), name="jobsite"),
]
