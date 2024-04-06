from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('api/lecturers', views.api_get_all),
    path('login', views.login),
    path('logout', views.logout),
]