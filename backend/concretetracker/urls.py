from django.conf.urls import url
from concretetracker import views

urlpatterns = [
    url(r'^api/signup', views.signup),
    url(r'^api/signin', views.signin)
]
