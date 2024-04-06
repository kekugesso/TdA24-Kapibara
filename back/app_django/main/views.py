from django.shortcuts import render
from django.core.serializers import serialize
from django.http import JsonResponse, HttpResponse
from .models import Lecturer

def index(request):
    return HttpResponse("<h2>Hello World</h2>")

def login(request):
    return HttpResponse("<h2>Login</h2>")

def logout(request):
    return HttpResponse("<h2>Logout</h2>")

def api_get_all(request):
    lecturers = Lecturer.objects.all()
    serialized_data = serialize('json', lecturers)
    return JsonResponse(serialized_data, safe=False)