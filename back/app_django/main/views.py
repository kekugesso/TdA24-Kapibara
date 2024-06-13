import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Lecturer, Tag, LectureTag, Contact, TelephoneNumber, Email, Reservation, Student, Subject, SubjectReservation
from .serializers import LecturerSerializer, ReservationSerializer, LecturerAllSerializer, UserSerializer


class LecturerAPIGetAll(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        queryset = Lecturer.objects.all()
        serialized_data = LecturerAllSerializer(queryset, many=True)
        return Response(serialized_data.data, status=200)

class LecturerAPIPost(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        #if(request.user.is_superuser == True):
        try:
            control = False
            data = request.data
            user = User(
                username=data['username']
            )
            user.save()
            user.set_password(data['password'])
            user.save()
            data['uuid'] = str(uuid.uuid4())
            lecturer = Lecturer(
                uuid=data['uuid'],
                user = user,
                first_name=data['first_name'],
                middle_name=data['middle_name'],
                last_name=data['last_name'],
                title_before=data['title_before'],
                title_after=data['title_after'],
                picture_url=data['picture_url'],
                location=data['location'],
                claim=data['claim'],
                bio=data['bio'],
                price_per_hour=data['price_per_hour']
            )
            
            lecturer.save()
            control = True
            contact = Contact(
                lecturer = lecturer
            )
            contact.save()
            data_contact = data['contact']
            for number in data_contact['telephone_numbers']:
                new_number = TelephoneNumber(
                    contact = contact,
                    phone = number
                )
                new_number.save()
            for email in data_contact['emails']:
                new_email = Email(
                    contact = contact,
                    email = email
                )
                new_email.save()
            for tag in data['tags']:
                control = True
                tgas = Tag.objects.all()
                for tg in tgas:
                    if tg.name == tag['name']:
                        LectureTag(lecturer_uuid=lecturer, tag_uuid=tg).save()
                        control = False
                        break
                if control:
                    tg = Tag(name=tag['name'], uuid=str(uuid.uuid4()))
                    tg.save()
                    LectureTag(lecturer_uuid=lecturer, tag_uuid=tg).save()
            lecturer_result = Lecturer.objects.get(uuid=data['uuid'])
            serialized_data = LecturerSerializer(lecturer_result)
            return Response(serialized_data.data, status=201)
        except Exception as e:
            return Response(status=400)
        #else:
            #return Response(status=403)
        
class LecturerAPIOne(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get(self, request, uuid):
        lecturer = get_object_or_404(Lecturer, uuid=uuid)
        serialized_data = LecturerSerializer(lecturer)
        return Response(serialized_data.data)

    def delete(self, request, uuid):
        lecturer = get_object_or_404(Lecturer, uuid=uuid)
        user = User.objects.get(id=lecturer.user.id)
        token = Token.objects.get(user=user)
        token.delete()
        user.delete()
        lecturer.delete()
        return Response(status=204)
    
    def put(self, request, uuid):
        try:
            lecturer = get_object_or_404(Lecturer, uuid=uuid)
            serializer = LecturerSerializer(lecturer)
            serialized_data = serializer.data
            data = request.data
            for key in serialized_data:
                if key not in data:
                    data[key] = serialized_data[key]
            lectrurertags = LectureTag.objects.filter(lecturer_uuid=lecturer).all()
            for tag in lectrurertags:
                tag.delete()
            tags = Tag.objects.all()
            for tag in data['tags']:
                for tg in tags:
                    if tg.name == tag['name']:
                        LectureTag(lecturer_uuid=lecturer, tag_uuid=tg).save()
                        data['tags'].remove(tag)
                        break
            if len(data['tags']) != 0:
                for tag in data['tags']:
                    tg = Tag(name=tag['name'], uuid=str(uuid.uuid4()))
                    tg.save()
                    LectureTag(lecturer_uuid=lecturer, tag_uuid=tg).save()
            contact = Contact.objects.get(lecturer=lecturer)
            emails = Email.objects.filter(contact=contact).all()
            for email in emails:
                email.delete()
            numbers = TelephoneNumber.objects.filter(contact=contact).all()
            for number in numbers:
                number.delete()
            data_contact = data['contact']
            for number in data_contact['telephone_numbers']:
                new_number = TelephoneNumber(
                    contact = contact,
                    phone = number
                )
                new_number.save()
            for email in data_contact['emails']:
                new_email = Email(
                    contact = contact,
                    email = email
                )
                new_email.save()
            lecturer.first_name = data['first_name']
            lecturer.middle_name = data['middle_name']
            lecturer.last_name = data['last_name']
            lecturer.title_before = data['title_before']
            lecturer.title_after = data['title_after']
            lecturer.picture_url = data['picture_url']
            lecturer.location = data['location']
            lecturer.claim = data['claim']
            lecturer.bio = data['bio']
            lecturer.price_per_hour = data['price_per_hour']
            lecturer.save()
            return Response(status=200)
        except Exception as e:
            return Response({"message": "You sent a bad json"}, status=400)

class ReservationAPIOne(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request, uuid):
        reservation = get_object_or_404(Reservation, uuid=uuid)
        if(reservation):
            serialized_data = ReservationSerializer(reservation)
            return Response(serialized_data.data, status=200)
        else:
            return Response(status=404)
    def delete(self, request, uuid):
        reservation = get_object_or_404(Reservation, uuid=uuid)
        if(reservation):
            reservation.delete()
            return Response(status=204)
        else:
            return Response(status=404)
    def put(self, request, uuid):
        try:
            reservation = get_object_or_404(Reservation, uuid=uuid)
            data = request.data
            serializer = ReservationSerializer(reservation)
            serialized_data = serializer.data
            for key in serialized_data:
                if key not in data:
                    data[key] = serialized_data[key]
            student = Student.objects.get(reservation_id=reservation.uuid)
            student.delete()
            new_student = Student(
                first_name = data['student']['first_name'],
                last_name = data['student']['last_name'],
                email = data['student']['email'],
                phone = data['student']['phone'],
                reservation_id = reservation.uuid
            )
            new_student.save()
            subject = Subject.objects.filter(reservation_id=reservation.uuid).all()
            for sub in subject:
                sub.delete()
            for sub in data['subjects']:
                new_subject = Subject(
                    name = sub['name'],
                    reservation_id = reservation.uuid
                )
                new_subject.save()
                SubjectReservation(reservation_id=reservation.uuid, subject_id=new_subject.uuid).save()
            reservation.status = data['status']
            reservation.start_time = data['start_time']
            reservation.end_time = data['end_time']
            reservation.location = data['location']
            reservation.description = data['description']
            reservation.save()
            return Response(status=200)
        except Exception as e:
            return Response({"message": "You sent a bad json"}, status=400)
    
class ReservationAPIAll(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = request.data
        one_lecturer = Lecturer.objects.get(user=request.user.id)
        reservations = Reservation.objects.filter(lecture_uuid_id=one_lecturer.uuid)
        serialized_data = ReservationSerializer(reservations, many=True)
        return Response(serialized_data.data, status=200)

class ReservationAPIPost(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        control = False
        data = request.data
        data['uuid'] = str(uuid.uuid4())
        reservation = Reservation(
            uuid=data['uuid'],
            status=data['status'],
            start_time=data['start_time'],
            end_time=data['end_time'],
            location=data['location'],
            description=data['description'],
            lecture_uuid_id=data['lecturer_uuid'],
        )
        reservation.save()
        control = True
        student = Student(
            first_name=data['student']['first_name'],
            last_name=data['student']['last_name'],
            email=data['student']['email'],
            phone=data['student']['phone'],
            reservation_id=reservation.uuid
        )
        student.save()
        subjects = Subject.objects.all()
        for i in data['subject']:
            for j in subjects:
                if i['name'] == j.name:
                    SubjectReservation(reservation_id=reservation.uuid, subject_id=j.uuid).save()
                    data['subject'].remove(i)
                    break
        if(len(data['subject']) > 0):
            for i in data['subject']:
                new_subject = Subject(name=i['name'], uuid=str(uuid.uuid4()))
                new_subject.save()
                SubjectReservation(reservation_id=reservation.uuid, subject_id=new_subject.uuid).save()
        serialized_data = ReservationSerializer(reservation)
        return Response(serialized_data.data, status=201)



class Logout(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=200)

class Login(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        data = request.data
        user = get_object_or_404(User, username=data['username'])
        if not user.check_password(data['password']):
            return Response(status=401)
        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(instance=user)
        return Response({'token': token.key, "user": serializer.data}, status=200)

class CheckToken(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        one_lecturer = Lecturer.objects.get(user=request.user.id)
        lecturer_serializer = LecturerSerializer(one_lecturer)
        return Response(lecturer_serializer.data["tags"], status=200)

class RezervationsDelete(APIView):
    permission_classes = [AllowAny]
    def delete(self, request, uuid):
        reservations = Reservation.objects.all(lecture_uuid=request.data["lecturer_uuid"])
        for reservation in reservations:
            reservation.delete()
        return Response(status=204)