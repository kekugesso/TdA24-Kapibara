from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Lecturer(db.Model):
    uuid = db.Column(db.Text, nullable = False, primary_key=True, unique=True)
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

    def __repr__(self):
        return f'<Lecturer {self.uuid}>'


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

    phone = db.Column(db.Text, nullable=False, primary_key=True, unique=True)
    contact_id = db.Column(db.Integer, db.ForeignKey('contact.id', ondelete='CASCADE'), nullable=False)

    def __repr__(self):
        return self.phone


class Email(db.Model):
    __tablename__ = 'email'

    email = db.Column(db.Text, nullable=False, primary_key=True, unique=True)
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

