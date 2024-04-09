from django.urls import path
from . import views

urlpatterns = [
    path('api/lecturers', views.LecturerAPIGetAll.as_view()),
    path('api/lecturer', views.LecturerAPIPost.as_view()),
    path('api/lecturer/<uuid>', views.LecturerAPIOne.as_view()),
    path('api/reservation/<uuid>', views.ReservationAPIOne.as_view()),
    path('api/reservations', views.ReservationAPIAll.as_view()),
    path('api/reservation', views.ReservationAPIPost.as_view()),
]