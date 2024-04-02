"""
modules that contains the application
"""
import os
from datetime import timedelta, datetime
import uuid
import webbrowser
import icalendar
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, request, redirect, url_for, flash, send_file, make_response
from sqlalchemy.exc import IntegrityError, DataError
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_migrate import Migrate
from app.models import db, Lecturer, Tag, TelephoneNumber, Email, LectureTag, Contact, Rezervation
from app.serializers import LecturerSchema, RezervationSchema
from app.utils import auth_required

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.secret_key = ']pv~x_fKX[U3hCDnfZ,$`olRWpXmb]H^EI+i3jPo<yZ*Yz276=:#N%};St-,GMS'
db.init_app(app)
migrate = Migrate(app, db)
app.permanent_session_lifetime = timedelta(hours=13)
login_manager = LoginManager()
login_manager.init_app(app)

app.config['AUTH_USERNAME'] = 'TdA'
app.config['AUTH_PASSWORD'] = 'd8Ef6!dGG_pv'

@login_manager.user_loader
def load_user(user_id):
    """
    function that loads a user
    """
    return Lecturer.query.get(user_id)

# ensure the instance folder exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass

@app.before_request
def before_request():
    """
    funcion that runs before each request
    """
    db.create_all()


@app.route('/api/lecturer', methods = ["POST"])
@auth_required
def title_post():
    """
    function that handles adding lecturers
    """
    if request.method == "POST":
        try:
            data = request.get_json()
            lecturer_uuid = str(uuid.uuid4())

            lecturer_uuids = [lecturer.uuid for lecturer in Lecturer.query.all()]
            while lecturer_uuid in lecturer_uuids:
                lecturer_uuid = str(uuid.uuid4())

            data["password"] = generate_password_hash(data.get("password"))
            new_lecturer = Lecturer(uuid=lecturer_uuid,
                                username=data["username"],
                                password=data["password"],
                                first_name=data["first_name"],
                                middle_name=data["middle_name"],
                                last_name=data["last_name"],
                                title_before=data["title_before"],
                                title_after=data["title_after"],
                                picture_url=data["picture_url"],
                                location=data["location"],
                                claim=data["claim"],
                                bio=data["bio"],
                                price_per_hour=data["price_per_hour"])
            db.session.add(new_lecturer)
            new_contact = Contact(lecturer_uuid=lecturer_uuid)
            db.session.add(new_contact)
            db.session.commit()
        except:
            return {'message': "Data Error"}, 400

        try:
            contact = Contact.query.filter_by(lecturer_uuid=lecturer_uuid).first()
            contacts = data.get("contact")
            emails = contacts.get('emails')
            telephone_numbers = contacts.get('telephone_numbers')
            for email in emails:
                new_email = Email(
                    email = email,
                    contact_id = contact.id,
                )
                db.session.add(new_email)
            for telephone_number in telephone_numbers:
                new_number = TelephoneNumber(
                    phone = telephone_number,
                    contact_id = contact.id,
                )
                db.session.add(new_number)
            for tag_name in data.get("tags"):
                tag_db = Tag.query.filter_by(name=tag_name).first()
                if tag_db:
                    new_lecture_tag = LectureTag(
                        tag_uuid=tag_db.uuid, lecturer_uuid=lecturer_uuid
                    )
                    db.session.add(new_lecture_tag)
                else:
                    tag_uuid = str(uuid.uuid4())
                    new_tag = Tag(uuid=tag_uuid, name=tag_name)
                    db.session.add(new_tag)
                    new_lecture_tag = LectureTag(
                        tag_uuid=tag_uuid, lecturer_uuid=lecturer_uuid
                    )
                    db.session.add(new_lecture_tag)
            db.session.commit()
            
        except:
            db.session.delete(new_lecturer)
            db.session.commit()
            return {'message' : "This values cant be a null"}, 400
        created_lecturer = Lecturer.query.filter_by(uuid=lecturer_uuid).first()
        lecturer_schema = LecturerSchema()
        result = lecturer_schema.dump(created_lecturer)
        return result, 200

@app.route('/api/lecturers', methods = ["GET"])
@auth_required
def title_get():
    """
    function that handles adding lecturers
    """
    elif request.method == "GET":
        lecturers = Lecturer.query.all()
        lecturer_schema = LecturerSchema(many=True)
        result = lecturer_schema.dump(lecturers)
        return result, 200


@app.route('/api/lecturer/<uuid1>', methods = ["GET", "DELETE", "PUT"])
@auth_required
def edit_lecturer(uuid1):
    """
    function that handles editing lecturers
    """
    one_lecturer = Lecturer.query.filter_by(uuid=uuid1).first()
    if request.method == "DELETE":
        if one_lecturer:
            db.session.delete(one_lecturer)
            db.session.commit()
            return {'message': "Lecturer has deleted successfully"}, 204
        else:
            return {'message': "Lecturer is not founded"}, 404
    elif request.method == "PUT":
        if one_lecturer:
            try:
                data = request.get_json()
                lecturer_schema = LecturerSchema()
                lecturer_data = lecturer_schema.dump(one_lecturer)
                for key in data:
                    if key in lecturer_data:
                        lecturer_data[key] = data.get(key)
                tags = lecturer_data.get('tags')
                if tags is None or None in tags:
                    return {'message': "Data Error"}, 400
                lecture_tags = LectureTag.query.filter_by(lecturer_uuid=uuid1).all()
                for delete in lecture_tags:
                    db.session.delete(delete)
                for tag_name in data.get("tags"):
                    tag_db = Tag.query.filter_by(name=tag_name).first()
                    if tag_db:
                        new_lecture_tag = LectureTag(
                            tag_uuid=tag_db.uuid, lecturer_uuid=uuid1
                        )
                        db.session.add(new_lecture_tag)
                    else:
                        tag_uuid = str(uuid.uuid4())
                        new_tag = Tag(uuid=tag_uuid, name=tag_name)
                        db.session.add(new_tag)
                        new_lecture_tag = LectureTag(
                            tag_uuid=tag_uuid, lecturer_uuid=uuid1
                        )
                        db.session.add(new_lecture_tag)
                contact = Contact.query.filter_by(lecturer_uuid=uuid1).first()
                emails = Email.query.filter_by(contact_id=contact.id).all()
                for email in emails:
                    db.session.delete(email)
                numbers = TelephoneNumber.query.filter_by(contact_id=contact.id).all()
                for number in numbers:
                    db.session.delete(number)
                contacts = lecturer_data.get('contact')
                for number in contacts.get('telephone_numbers'):
                    new_number = TelephoneNumber(
                        phone = number,
                        contact_id=contact.id
                    )
                    db.session.add(new_number)
                for email in contacts.get('emails'):
                    new_email = Email(
                        email = email,
                        contact_id = contact.id
                    )
                    db.session.add(new_email)
                one_lecturer.title_before = lecturer_data.get('title_before')
                one_lecturer.username =  lecturer_data.get('username')
                one_lecturer.password =  generate_password_hash(lecturer_data.get('password'))
                one_lecturer.first_name = lecturer_data.get('first_name')
                one_lecturer.middle_name = lecturer_data.get('middle_name')
                one_lecturer.last_name = lecturer_data.get('last_name')
                one_lecturer.title_after = lecturer_data.get('title_after')
                one_lecturer.picture_url = lecturer_data.get('picture_url')
                one_lecturer.location = lecturer_data.get('location')
                one_lecturer.bio = lecturer_data.get('bio')
                one_lecturer.claim = lecturer_data.get('claim')
                one_lecturer.price_per_hour = lecturer_data.get('price_per_hour')
                db.session.commit()
                lecturer_schema = LecturerSchema()
                result = lecturer_schema.dump(one_lecturer)
                return result, 200
            except:
                return {"message": "Some values cant be null"}, 400
        else:
            return {"message": "Lecturer is not founded"}, 404
    elif request.method == "GET":
        one_lecturer = Lecturer.query.filter_by(uuid=uuid1).first()
        if one_lecturer:
            lecturer_schema = LecturerSchema()
            result = lecturer_schema.dump(one_lecturer)
            return result, 200
        else:
            return {"message": "Lecturer is not founded"}, 404

if __name__ == '__main__':
    app.run(debug=True)
