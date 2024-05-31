from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Lecturer, Tag, LectureTag, Reservation, Contact, Student, Subject


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['uuid', 'name']

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['first_name', 'last_name', 'email', 'phone']

class ReservationSerializer(serializers.ModelSerializer):
    student = StudentSerializer()
    subject = SubjectSerializer(many=True)
    class Meta:
        model = Reservation
        fields = ['uuid', 'status', 'start_time', 'end_time', 'student', 'location', 'description', 'subject']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['uuid', 'name']

class ContactSerializer(serializers.ModelSerializer):
    telephone_numbers = serializers.SerializerMethodField()
    emails = serializers.SerializerMethodField()

    class Meta:
        model = Contact
        fields = ['telephone_numbers', 'emails']

    def get_telephone_numbers(self, obj):
        return [number.phone for number in obj.telephonenumber_set.all()]

    def get_emails(self, obj):
        return [email.email for email in obj.email_set.all()]

class LecturerSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    contact = ContactSerializer()
    reservations = ReservationSerializer(many=True)
    user = UserSerializer()
    class Meta:
        model = Lecturer
        fields = ['uuid','user', 'title_before', 'first_name', 'middle_name', 'last_name', 'title_after', 'picture_url', 
                  'location', 'claim', 'bio', 'tags', 'price_per_hour', 'contact', 'reservations']
        
class LecturerAllSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    contact = ContactSerializer()
    user = UserSerializer()
    class Meta:
        model = Lecturer
        fields = ['uuid', 'user', 'title_before', 'first_name', 'middle_name', 'last_name', 'title_after', 'picture_url', 
                  'location', 'claim', 'bio', 'tags', 'price_per_hour', 'contact']