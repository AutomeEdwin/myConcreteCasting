from .views import Register, Login, Logout, DeleteUser, UpdateUser, UpdateUserPassword, Jobsites, getJobsiteByID, calculateCuringTime, getJobsiteWeather
from django.urls import path

urlpatterns = [
    path('register/', Register.as_view(), name='register'),
    path('login/', Login.as_view(), name='login'),
    path('logout/', Logout.as_view(), name='logout'),
    path('deleteUser/<user_id>', DeleteUser.as_view(), name='account'),
    path('updateUser/<user_id>', UpdateUser.as_view()),
    path('updateUserPassword/<user_id>', UpdateUserPassword.as_view()),
    path('jobsites/', Jobsites.as_view(), name="jobsite"),
    path('jobsites/<owner_id>', Jobsites.as_view(), name="jobsite"),
    path('jobsites/<owner_id>/<id>', getJobsiteByID.as_view()),
    path('calculateCuringTime/', calculateCuringTime.as_view()),
    path('getJobsiteWeather/', getJobsiteWeather.as_view()),
]
