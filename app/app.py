import os
import json
import uuid
from flask import *
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError, DataError
from app.models import db, Lecturer, Tag, TelephoneNumber, Email, lecture_tag, Contact
from app.serializers import LecturerSchema
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

@app.before_request
def before_request():
    db.create_all()

@app.route('/')  # title page
def title():
    return render_template('index.html')


@app.route('/api')  # api
def json_api():
    return json.dumps('{ "secret": "The cake is a lie"}')


@app.route('/api/lecturers', methods = ["GET", "POST"])  # lecturer
def lecturer_static():
    if request.method == "GET":
        lecturers = Lecturer.query.all()
        if lecturers:
            print(lecturers)
            lecturer_schema = LecturerSchema(many=True)
            result = lecturer_schema.dump(lecturers)
            return render_template('lecturers.html', data=lecturers)
        else:
            return {'message': "Lecturers is not founded"}, 404
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
        except (DataError):
            return {'message' : "Data-error"}, 400
        if (IntegrityError):
            result = json.loads('{"message":"Lector has been added, but triggerd a IntegrityError", "uuid":"%s"}' % (lecturer_uuid))
        else: 
            result = json.loads('{"message":"Lector has been succesfully added", "uuid":"%s"}' % (lecturer_uuid))
        lecturer = Lecturer.query.filter_by(uuid=lecturer_uuid).first()
        lecturer_schema = LecturerSchema()
        return json.dumps({**result, **json.loads(str(lecturer_schema.dumps(lecturer)))}), 200



@app.route('/api/lecturer/<uuid>', methods = ["GET", "PUT", "DELETE"])  # Lecturer - spesific
def lecturer_specific(uuid):
    lecturer = Lecturer.query.filter_by(uuid=uuid).first()
    if request.method == "GET":
        if lecturer:
            lecturer_schema = LecturerSchema()
            result = lecturer_schema.dump(lecturer)
            return render_template('lecturer.html', lecturer_uuid=uuid, data=result)
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
            return {"message": "Lecturer has changed succesfully"}, 200
        else:
            return {"message": "Lecturer is not founded"}, 404

if __name__ == '__main__':
    app.run(debug=True)
