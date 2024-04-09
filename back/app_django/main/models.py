from django.db import models

class Status(models.TextChoices):
    RESERVED = 'reserved'
    UNAVAILABLE = 'unavailable'

class Lecturer(models.Model):
    """
    Model database for lecturers
    """
    uuid = models.TextField(max_length=255, primary_key=True)
    username = models.TextField(null=False, unique=True)
    password = models.TextField(null=False)
    title_before = models.TextField(null=True)
    first_name = models.TextField(null=False)
    middle_name = models.TextField(null=True)
    last_name = models.TextField(null=False)
    title_after = models.TextField(null=True)
    picture_url = models.TextField(null=True)
    location = models.TextField(null=True)
    claim = models.TextField(null=True)
    bio = models.TextField(null=True)
    price_per_hour = models.IntegerField(null=True)
    tags = models.ManyToManyField('Tag', through='LectureTag')

    def __repr__(self):
        return f"<Lecturer {self.uuid}>"

class Tag(models.Model):
    """
    Model database for tags
    """
    uuid = models.TextField(primary_key=True)
    name = models.TextField(null=False)

    def __repr__(self):
        return f"<Tag {self.uuid}>"

class LectureTag(models.Model):
    """
    Model database for lecture_tag
    """
    id = models.AutoField(primary_key=True)
    lecturer_uuid = models.ForeignKey('Lecturer', on_delete=models.CASCADE)
    tag_uuid = models.ForeignKey('Tag', on_delete=models.CASCADE)

    def __repr__(self):
        return f"<lecture_tag {self.lecturer_uuid}>"

class Reservation(models.Model):
    """
    Model database for reservation
    """
    uuid = models.TextField(primary_key=True)
    status = models.CharField(choices=Status.choices, default=Status.RESERVED)
    start_time = models.DateTimeField(null=False)
    end_time = models.DateTimeField(null=False)
    location = models.TextField(null=False)
    description = models.TextField(null=True)
    subject = models.ManyToManyField('Subject', through='SubjectReservation')
    lecture_uuid = models.ForeignKey('Lecturer', on_delete=models.CASCADE, related_name='reservations')

    def __repr__(self):
        return f"<Reservation {self.lecture_uuid}>"

class Student(models.Model):
    """
    Model database for student
    """
    id = models.AutoField(primary_key=True)
    first_name = models.TextField(null=False)
    last_name = models.TextField(null=False)
    email = models.TextField(null=False)
    phone = models.TextField(null=False)
    reservation = models.OneToOneField('Reservation', on_delete=models.CASCADE)

    def __repr__(self):
        return f"<Student {self.id}>"

class SubjectReservation(models.Model):
    """
    Model database for subject reservation
    """
    id = models.AutoField(primary_key=True)
    reservation = models.ForeignKey('Reservation', on_delete=models.CASCADE)
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE)

    def __repr__(self):
        return f"<SubjectReservation {self.reservation}>"

class Subject(models.Model):
    """
    Model database for subject
    """
    uuid = models.TextField(primary_key=True)
    name = models.TextField(null=False)

    def __repr__(self):
        return f"<Subject {self.uuid}>"

class Contact(models.Model):
    """
    Model database for contact
    """
    id = models.AutoField(primary_key=True)
    lecturer = models.OneToOneField('Lecturer', on_delete=models.CASCADE)
    def __repr__(self):
        return f"<Contact {self.id}>"

class Email(models.Model):
    """
    Model database for email
    """
    id = models.AutoField(primary_key=True)
    email = models.TextField(null=False)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)

    def __str__(self):
        return self.email

class TelephoneNumber(models.Model):
    """
    Model database for telephone number
    """
    id = models.AutoField(primary_key=True)
    phone = models.TextField(null=False)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)

    def __str__(self):
        return self.phone
