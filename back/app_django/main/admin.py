from django.contrib import admin
from .models import Lecturer, Tag, LectureTag, Reservation, Contact, Email, TelephoneNumber

admin.site.register(Lecturer)
admin.site.register(LectureTag)
admin.site.register(Tag)
admin.site.register(Reservation)
admin.site.register(Contact)
admin.site.register(Email)
admin.site.register(TelephoneNumber)