import os
import json
import uuid
from flask import *
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError, DataError
from models import db, Lecturer, Tag, TelephoneNumber, Email, lecture_tag, Contact
from serializers import LecturerSchema
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db.init_app(app)
migrate = Migrate(app, db)


# ensure the instance folder exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass

#@app.before_request
#def before_request():
#    db.create_all()


@app.route('/', methods = ["GET", "POST"])  # title page
def title():
    if request.method == "GET":
        lecturers = Lecturer.query.all()
        lecturer_schema = LecturerSchema(many=True)
        result = lecturer_schema.dump(lecturers)
        return render_template('home.html', 
                           data=result, 
                           unique_tags=get_unique_tags(result),
                           unique_locations=get_unique_locations(result)
                           )
    elif request.method == "POST":
        try:
            data = request.get_json()
            lecturer_uuid = str(uuid.uuid4())
            lecturers = Lecturer.query.all()
            lecturer_uuids = []
            for lecturer in lecturers:
                lecturer_uuids.append(lecturer.uuid)
            while(lecturer_uuid in lecturer_uuids):
                lecturer_uuid = str(uuid.uuid4())
            new_lecturer = Lecturer(
                uuid = lecturer_uuid,
                title_before = data.get("title_before"),
                first_name = data.get("first_name"),
                middle_name = data.get("middle_name"),
                last_name = data.get("last_name"),
                title_after = data.get("title_after"),
                picture_url = data.get("picture_url"),
                location = data.get("location"),
                claim = data.get("claim"),
                bio = data.get("bio"),
                price_per_hour = data.get("price_per_hour"),
            )
            db.session.add(new_lecturer)
            db.session.commit()
            new_contact = Contact(lecturer_uuid = lecturer_uuid)
            db.session.add(new_contact)
            db.session.commit()
            contact = Contact.query.filter_by(lecturer_uuid = lecturer_uuid).first()
            contacts = data.get("contact")
            emails = contacts.get('emails')
            telephone_numbers = contacts.get('telephone_numbers')
            for email in emails:
                new_email = Email(
                    email = email,
                    contact_id = contact.id,
                )
                db.session.add(new_email)
                db.session.commit()
            for telephone_number in telephone_numbers:
                new_number = TelephoneNumber(
                    phone = telephone_number,
                    contact_id = contact.id,
                )
                db.session.add(new_number)
                db.session.commit()
            for tag in data.get("tags"):
                tags = Tag.query.all()
                tags_name = []
                for tag1 in tags:
                    tags_name.append(tag1.name)
                if tag.get('name') not in tags_name:
                    tag_uuid = str(uuid.uuid4())
                    new_tag = Tag(
                        uuid = tag_uuid,
                        name = tag.get('name'),
                    )
                    db.session.add(new_tag)
                    db.session.commit()
                    new_lecture_tag = lecture_tag(
                        lecturer_uuid = lecturer_uuid,
                        tag_uuid = tag_uuid,
                    )
                    db.session.add(new_lecture_tag)
                    db.session.commit()
                else:
                    for tag2 in tags:
                        if tag.get('name') == tag2.name:
                            tag_uuid = tag2.uuid
                    new_lecture_tag = lecture_tag(
                        lecturer_uuid = lecturer_uuid,
                        tag_uuid = tag_uuid,
                    )
                    db.session.add(new_lecture_tag)
                    db.session.commit()
        except (IntegrityError, DataError):
            return {'message' : "This values cant be a null"}, 400
        created_lecturer = Lecturer.query.filter_by(uuid=lecturer_uuid).first()
        lecturer_schema = LecturerSchema()
        result = lecturer_schema.dump(created_lecturer)
        return result, 200


def get_unique_tags(data):
    unique_tags = []
    for lecturer in data:
        tags = lecturer.get('tags', [])
        if isinstance(tags, list):
            for tag in tags:
                tag_name = tag
                if tag_name and tag_name not in unique_tags:
                    unique_tags.append(tag_name)
    return unique_tags


def get_unique_locations(data):
    unique_locations = []
    for lecturer in data:
        location = lecturer.get('location')
        if location and location not in unique_locations:
                    unique_locations.append(location)
    return unique_locations



@app.route('/lecturer/<uuid1>', methods = ["GET", "DELETE", "PUT"])  # Lecturer - spesific
def lecturer(uuid1):
    lecturer = Lecturer.query.filter_by(uuid=uuid1).first()
    if request.method == "GET":
        if lecturer:
            lecturer_schema = LecturerSchema()
            result = lecturer_schema.dump(lecturer)
            return render_template('lecturer.html', data=result)
        else:
            return {'message': "Lector is not founded"}, 404
    elif request.method == "DELETE":
        if lecturer:
            db.session.delete(lecturer)
            db.session.commit()
            return {'message': "Lecturer has deleted successfully"}, 204
        else:
            return {'message': "Lecturer is not founded"}, 404
    elif request.method == "PUT":
        if lecturer:
            data = request.get_json()
            lecturer_schema = LecturerSchema()
            lecturer_data = lecturer_schema.dump(lecturer)
            for key in data:
                if key in lecturer_data:
                    lecturer_data[key] = data.get(key)
            print(lecturer_data)
            lecture_tags = lecture_tag.query.filter_by(lecturer_uuid=uuid1).all()
            for delete in lecture_tags:
                db.session.delete(delete)
                db.session.commit()
            tags = lecturer_data.get('tags')
            for tag in tags:
                tagsdb = Tag.query.all()
                for tagdb in tagsdb:
                    if tag['name'] == tagdb.name:
                        new_lecture_tag = lecture_tag(
                            lecturer_uuid = uuid1,
                            tag_uuid = tagdb.uuid,
                        )
                        db.session.add(new_lecture_tag)
                        db.session.commit()
                        tags.remove(tag)
            if tags != []:
                for tag in tags:
                    tag_uuid = str(uuid.uuid4())
                    new_tag = Tag(
                        uuid = tag_uuid,
                        name = tag["name"]
                    )
                    db.session.add(new_tag)
                    db.session.commit()
                    new_lecture_tag = lecture_tag(
                        lecturer_uuid = uuid1,
                        tag_uuid = tag_uuid
                    )
                    db.session.add(new_lecture_tag)
                    db.session.commit()
            contact = Contact.query.filter_by(lecturer_uuid=uuid1).first()
            emails = Email.query.filter_by(contact_id=contact.id).all()
            for email in emails:
                db.session.delete(email)
                db.session.commit()
            numbers = TelephoneNumber.query.filter_by(contact_id=contact.id).all()
            for number in numbers:
                db.session.delete(number)
                db.session.commit()
            contacts = lecturer_data.get('contact')
            for number in contacts.get('telephone_numbers'):
                new_number = TelephoneNumber(
                    phone = number,
                    contact_id=contact.id
                )
                db.session.add(new_number)
                db.session.commit()
            for email in contacts.get('emails'):
                new_email = Email(
                    email = email,
                    contact_id = contact.id
                )
                db.session.add(new_email)
                db.session.commit()
            lecturer.title_before = lecturer_data.get('title_before')
            lecturer.first_name = lecturer_data.get('first_name')
            lecturer.middle_name = lecturer_data.get('middle_name')
            lecturer.last_name = lecturer_data.get('last_name')
            lecturer.title_after = lecturer_data.get('title_after')
            lecturer.picture_url = lecturer_data.get('picture_url')
            lecturer.location = lecturer_data.get('location')
            lecturer.bio = lecturer_data.get('bio')
            lecturer.claim = lecturer_data.get('claim')
            lecturer.price_per_hour = lecturer_data.get('price_per_hour')
            db.session.commit()
            lecturer_schema = LecturerSchema()
            result = lecturer_schema.dump(lecturer)
            return result, 200
        else:
            return {"message": "Lecturer is not founded"}, 404

if __name__ == '__main__':
    app.run(debug=True)
