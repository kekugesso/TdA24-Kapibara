from rest_framework import generics
import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Lecturer, Tag, LectureTag, Contact, TelephoneNumber, Email, Reservation, Student, Subject, SubjectReservation
from .serializers import LecturerSerializer, ReservationSerializer


class LecturerAPIGetAll(APIView):
    def get(self, request):
        queryset = Lecturer.objects.all()
        serialized_data = LecturerSerializer(queryset, many=True)
        return Response(serialized_data.data, status=200)

class LecturerAPIPost(APIView):
    def post(self, request):
        control = False
        try:
            data = request.data
            data['uuid'] = str(uuid.uuid4())
            lecturer = Lecturer(
                uuid=data['uuid'],
                username=data['username'],
                password=data['password'],
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
            if control:
                lecturer.delete()
            return Response(status=400)

class LecturerAPIOne(APIView):
    def get(self, request, uuid):
        lecturer = get_object_or_404(Lecturer, uuid=uuid)
        serialized_data = LecturerSerializer(lecturer)
        return Response(serialized_data.data)

    def delete(self, request, uuid):
        lecturer = get_object_or_404(Lecturer, uuid=uuid)
        lecturer.delete()
        return Response(status=204)

class ReservationAPIOne(APIView):
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
    
class ReservationAPIAll(APIView):
    def get(self, request):
        data = request.data
        reservations = Reservation.objects.filter(lecture_uuid_id=data['lecturer_uuid'])
        serialized_data = ReservationSerializer(reservations, many=True)
        return Response(serialized_data.data, status=200)

class ReservationAPIPost(APIView):
    def post(self, request):
        data = request.data
        data['uuid'] = str(uuid.uuid4())
        reservation = Reservation(
            uuid=data['uuid'],
            status=data['status'],
            start_time=data['start_time'],
            end_time=data['end_time'],
            location=data['location'],
            description=data['description'],
            lecture_uuid_id=data['lecturer_uuid']
        )
        reservation.save()
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
                    SubjectReservation(reservation_id=reservation, subject_id=j).save()
                    data['subject'].remove(i)
                    break
        if(len(data['subject']) > 0):
            for i in data['subject']:
                new_subject = Subject(name=i['name'], uuid=str(uuid.uuid4()))
                new_subject.save()
                SubjectReservation(reservation_id=reservation, subject_id=new_subject).save()
        serialized_data = ReservationSerializer(reservation)
        return Response(serialized_data.data, status=201)
            