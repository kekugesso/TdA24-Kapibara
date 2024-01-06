from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class Lecturer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.Text, nullable = False)
    title_before = db.Column(db.Text, nullable=False)
    first_name = db.Column(db.Text, nullable=False)
    middle_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    title_after = db.Column(db.Text, nullable=False)
    picture_url = db.Column(db.Text, nullable=False)
    location = db.Column(db.Text, nullable=False)
    claim = db.Column(db.Text, nullable=False)
    bio = db.Column(db.Text, nullable=False)
    price_per_hour = db.Column(db.Integer, nullable=False)
    
    tags = db.relationship('Tag', secondary='lecture_tag', back_populates='lecturers')

    contacts_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), nullable=True)

    contacts = db.relationship('Contacts', back_populates='lecturer', uselist=False)

    def __repr__(self):
        return f'<Lecturer {self.id}>'

class Tags(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.Text, nullable = False)
    name = db.Column(db.Text, nullable=False)
    lecturers = db.relationship('Lecturer', secondary='lecture_tag', back_populates='tags')

    def __repr__(self):
        return f'<Tags {self.id}>'

class Contacts(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    phone1 = db.Column(db.Text, nullable = False)
    phone2 = db.Column(db.Text, nullable = True)
    email1 = db.Column(db.Text, nullable = False)
    email2 = db.Column(db.Text, nullable = True)

    lecturer = db.relationship('Lecturer', back_populates='contacts', uselist=False)

    def __repr__(self):
        return f'<Contacts {self.id}>'

lecture_tag = db.Table('lecture_tag',
                    db.Column('lecture_id', db.Integer, db.ForeignKey('lecturer.id')),
                    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'))
                    )

