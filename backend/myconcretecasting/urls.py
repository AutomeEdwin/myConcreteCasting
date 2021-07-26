from .views import Register, Login, Logout, DeleteUser, UpdateUser, Jobsites, getJobsiteByID
from django.urls import path

urlpatterns = [
    path('register/', Register.as_view(), name='register'),
    path('login/', Login.as_view(), name='login'),
    path('logout/', Logout.as_view(), name='logout'),
    path('deleteUser/<username>', DeleteUser.as_view(), name='account'),
    path('updateUser/<username>', UpdateUser.as_view()),
    path('jobsites/', Jobsites.as_view(), name="jobsite"),
    path('jobsites/<jobsite_owner>', Jobsites.as_view(), name="jobsite"),
    path('jobsites/<jobsite_owner>/<id>', getJobsiteByID.as_view()),

]
