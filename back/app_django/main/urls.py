from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('api/lecturers', views.LecturerAPIGetAll.as_view()),
    path('api/lecturer', views.LecturerAPIPost.as_view()),
    path('api/lecturer/<uuid>', views.LecturerAPIOne.as_view()),
    path('api/reservation/<uuid>', views.ReservationAPIOne.as_view()),
    path('api/reservations', views.ReservationAPIAll.as_view()),
    path('api/reservation', views.ReservationAPIPost.as_view()),
    path('api/login', views.Login.as_view()),
    path('api/logout', views.Logout.as_view()),
    path('api/token', views.CheckToken.as_view()),
    path('api/delreservation', views.RezervationsDelete.as_view()),
    path('api/reservationtoken', views.ReservationAPIPostToken.as_view()),
]