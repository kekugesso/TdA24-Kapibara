from django.db import models

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
    contact = models.OneToOneField('Contact', on_delete=models.CASCADE)

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
    id = models.IntegerField(primary_key=True)
    lecturer_uuid = models.ForeignKey('Lecturer', on_delete=models.CASCADE)
    tag_uuid = models.ForeignKey('Tag', on_delete=models.CASCADE)

    def __repr__(self):
        return f"<lecture_tag {self.lecturer_uuid}>"

class Reservation(models.Model):
    """
    Model database for reservation
    """
    id = models.IntegerField(primary_key=True)
    start_time = models.DateTimeField(null=False)
    end_time = models.DateTimeField(null=False)
    first_name_student = models.TextField(null=False)
    last_name_student = models.TextField(null=False)
    email_student = models.TextField(null=False)
    number_student = models.TextField(null=True)
    location = models.TextField(null=False)
    notes = models.TextField(null=True)
    subject = models.TextField(null=False)
    lecture_uuid = models.ForeignKey('Lecturer', on_delete=models.CASCADE)

    def __repr__(self):
        return f"<Reservation {self.lecture_uuid}>"
    
class Contact(models.Model):
    """
    Model database for contact
    """
    id = models.IntegerField(primary_key=True)
    lecturer_uuid = models.ForeignKey('Lecturer', on_delete=models.CASCADE, related_name='lecturer_contact')

    def __repr__(self):
        return f"<Contact {self.lecturer_uuid}>"

class Email(models.Model):
    """
    Model database for email
    """
    id = models.IntegerField(primary_key=True)
    email = models.TextField(null=False)
    contact_id = models.ForeignKey('Contact', on_delete=models.CASCADE)

    def __str__(self):
        return self.email

class TelephoneNumber(models.Model):
    """
    Model database for telephone number
    """
    id = models.IntegerField(primary_key=True)
    phone = models.TextField(null=False)
    contact_id = models.ForeignKey('Contact', on_delete=models.CASCADE)

    def __str__(self):
        return self.phone
