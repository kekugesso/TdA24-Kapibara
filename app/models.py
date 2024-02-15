from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Lecturer(UserMixin, db.Model):
    uuid = db.Column(db.Text, nullable = False, primary_key=True, unique=True)
    username = db.Column(db.Text, index=True, unique=True)
    password = db.Column(db.Text, nullable=False)
    title_before = db.Column(db.Text, nullable=True)
    first_name = db.Column(db.Text, nullable=False)
    middle_name = db.Column(db.Text, nullable=True)
    last_name = db.Column(db.Text, nullable=False)
    title_after = db.Column(db.Text, nullable=True)
    picture_url = db.Column(db.Text, nullable=True)
    location = db.Column(db.Text, nullable=True)
    claim = db.Column(db.Text, nullable=True)
    bio = db.Column(db.Text, nullable=True)
    price_per_hour = db.Column(db.Integer, nullable=True)
    
    tags = db.relationship('Tag', secondary='lecture_tag', back_populates='lecturers')

    contact = db.relationship('Contact', uselist=False, backref='lecturer', cascade='all, delete-orphan')

    rezervation = db.relationship('Rezervation', backref='lecturer', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Lecturer {self.uuid}>'

    def get_id(self):
        return str(self.uuid)


class Tag(db.Model):
    uuid = db.Column(db.Text, nullable=False, primary_key=True, unique=True)
    name = db.Column(db.Text, nullable=False)
    lecturers = db.relationship('Lecturer', secondary='lecture_tag', back_populates='tags')

    def __repr__(self):
        return f'<Tag {self.uuid}>'
    

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lecturer_uuid = db.Column(db.Text, db.ForeignKey('lecturer.uuid', ondelete='CASCADE'), nullable=False)
    emails = db.relationship('Email', backref='contact', cascade='all, delete-orphan')
    telephone_numbers = db.relationship('TelephoneNumber', backref='contact', cascade='all, delete-orphan')


class TelephoneNumber(db.Model):
    __tablename__ = 'telephone_number'

    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.Text, nullable=False)
    contact_id = db.Column(db.Integer, db.ForeignKey('contact.id', ondelete='CASCADE'), nullable=False)

    def __repr__(self):
        return self.phone


class Email(db.Model):
    __tablename__ = 'email'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Text, nullable=False)
    contact_id = db.Column(db.Integer, db.ForeignKey('contact.id', ondelete='CASCADE'), nullable=False)

    def __repr__(self):
        return self.email


class lecture_tag(db.Model):
    __tablename__ = 'lecture_tag'
    id = db.Column(db.Integer, primary_key=True)
    lecturer_uuid = db.Column(db.Text, db.ForeignKey('lecturer.uuid', ondelete='CASCADE'))
    tag_uuid = db.Column(db.Text, db.ForeignKey('tag.uuid', ondelete='CASCADE'))

    def __repr__(self):
        return f"<lecture_tag {self.lecturer_uuid}>"
    
class Rezervation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Text, nullable=False)
    start_time = db.Column(db.Integer, nullable=False)
    end_time = db.Column(db.Integer, nullable=False)
    first_name_student = db.Column(db.Text, nullable=True)
    second_name_student = db.Column(db.Text, nullable=True)
    email_student = db.Column(db.Text, nullable=True)
    number_student = db.Column(db.Text, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    subject = db.Column(db.Text, nullable=False)
    lecturer_uuid = db.Column(db.Text, db.ForeignKey('lecturer.uuid', ondelete='CASCADE'), nullable=False)

    def __repr__(self):
        return f"<Rezervation {self.id}>"
    