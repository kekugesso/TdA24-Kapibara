"""
modules that contains the application
"""
import os
from datetime import timedelta, datetime
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, request, redirect, url_for, flash
from sqlalchemy.exc import IntegrityError, DataError
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_migrate import Migrate
from models import db, Lecturer, Tag, TelephoneNumber, Email, LectureTag, Contact, Rezervation
from serializers import LecturerSchema

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.secret_key = ']pv~x_fKX[U3hCDnfZ,$`olRWpXmb]H^EI+i3jPo<yZ*Yz276=:#N%};St-,GMS'
db.init_app(app)
migrate = Migrate(app, db)
app.permanent_session_lifetime = timedelta(hours=13)
login_manager = LoginManager()
login_manager.init_app(app)



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



@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    function that handles the login
    """
    if current_user.is_authenticated:
        return redirect(url_for('lecturer_admin', uuid=current_user.uuid))

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = Lecturer.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('lecturer_admin', uuid=user.uuid))
        else:
            flash('Invalid username or password')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    """
    function that handles the logout
    """
    logout_user()
    return redirect(url_for('login'))


@app.route('/', methods = ["GET", "POST"])  # title page
def title():
    """
    function that handles the title
    """
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
        if 
        try:
            data = request.get_json()
            lecturer_uuid = str(uuid.uuid4())
            lecturers = Lecturer.query.all()
            lecturer_uuids = []
            for one_lecturer in lecturers:
                lecturer_uuids.append(one_lecturer.uuid)
            while lecturer_uuid in lecturer_uuids:
                lecturer_uuid = str(uuid.uuid4())
            new_lecturer = Lecturer(
                uuid = lecturer_uuid,
                username = data.get("username"),
                password = generate_password_hash(data.get("password")),
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
                    new_lecture_tag = LectureTag(
                        lecturer_uuid = lecturer_uuid,
                        tag_uuid = tag_uuid,
                    )
                    db.session.add(new_lecture_tag)
                    db.session.commit()
                else:
                    for tag2 in tags:
                        if tag.get('name') == tag2.name:
                            tag_uuid = tag2.uuid
                    new_lecture_tag = LectureTag(
                        lecturer_uuid = lecturer_uuid,
                        tag_uuid = tag_uuid,
                    )
                    db.session.add(new_lecture_tag)
                    db.session.commit()
        except (IntegrityError, DataError, AttributeError):
            return {'message' : "This values cant be a null"}, 400
        created_lecturer = Lecturer.query.filter_by(uuid=lecturer_uuid).first()
        lecturer_schema = LecturerSchema()
        result = lecturer_schema.dump(created_lecturer)
        return result, 200


def get_unique_tags(data):
    """
    function that handles sorting unique tags
    """
    unique_tags = []
    for one_lecturer in data:
        tags = one_lecturer.get('tags', [])
        if isinstance(tags, list):
            for tag in tags:
                tag_name = tag
                if tag_name and tag_name not in unique_tags:
                    unique_tags.append(tag_name)
    return unique_tags


def get_unique_locations(data):
    """
    function that handles sorting unique locations
    """
    unique_locations = []
    for one_lecturer in data:
        location = one_lecturer.get('location')
        if location and location not in unique_locations:
            unique_locations.append(location)
    return unique_locations



@app.route('/lecturer/<uuid1>', methods = ["GET", "DELETE", "PUT"])  # Lecturer - spesific
def lecturer(uuid1):
    """
    function that handles specific cards for lecturers
    """
    one_lecturer = Lecturer.query.filter_by(uuid=uuid1).first()
    if request.method == "GET":
        if one_lecturer:
            lecturer_schema = LecturerSchema()
            result = lecturer_schema.dump(one_lecturer)
            return render_template('lecturer.html', data=result)
        else:
            return {'message': "Lector is not founded"}, 404
    elif request.method == "DELETE":
        if one_lecturer:
            db.session.delete(one_lecturer)
            db.session.commit()
            return {'message': "Lecturer has deleted successfully"}, 204
        else:
            return {'message': "Lecturer is not founded"}, 404
    elif request.method == "PUT":
        if one_lecturer:
            data = request.get_json()
            lecturer_schema = LecturerSchema()
            lecturer_data = lecturer_schema.dump(one_lecturer)
            print(lecturer_data)
            for key in data:
                if key in lecturer_data:
                    lecturer_data[key] = data.get(key)
            lecture_tags = LectureTag.query.filter_by(lecturer_uuid=uuid1).all()
            for delete in lecture_tags:
                db.session.delete(delete)
                db.session.commit()
            tags = lecturer_data.get('tags')
            for tag in tags:
                tagsdb = Tag.query.all()
                for tagdb in tagsdb:
                    if tag['name'] == tagdb.name:
                        new_lecture_tag = LectureTag(
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
                    new_lecture_tag = LectureTag(
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
            one_lecturer.title_before = lecturer_data.get('title_before')
            one_lecturer.username =  lecturer_data.get('username')
            one_lecturer.password =  lecturer_data.get('password')
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
        else:
            return {"message": "Lecturer is not founded"}, 404

@app.route("/lecturer/<uuid>/admin", methods=["GET"])
@login_required
def lecturer_admin(uuid):
    """
    function that handles admin page for loginned lecturer
    """
    if current_user.uuid == uuid:
        if request.method == "GET":
            one_lecturer = Lecturer.query.filter_by(uuid=uuid).first()
            lecturer_schema = LecturerSchema()
            result = lecturer_schema.dump(one_lecturer)
            data = result.get("rezervation")
            return render_template("lecturer_admin.html", data=data), 200
    else:
        return {"message": "naaaaaah bro"}, 403

@app.route("/rezervace/<id_rezrvace>", methods=["GET", "DELETE"])
def rezervace(id_rezrvace):
    """
    function that handles show specific rezervation
    """
    if request.method == "GET":
        rezervation = Rezervation.query.filter_by(id=id_rezrvace).first()
        if rezervation:
            uuid_lecturer = rezervation.lecturer_uuid
            one_lecturer = Lecturer.query.filter_by(uuid=uuid_lecturer).first()
            one_lecturer_schema = LecturerSchema()
            result = one_lecturer_schema.dump(one_lecturer)
            return render_template("rezervace.html", rezervace=result), 200
        else:
            return {"message": "Rezervace is not founded"}, 404
    elif request.method == "DELETE":
        rezervation = Rezervation.query.filter_by(id=id_rezrvace).first()
        if rezervation:
            db.session.delete(rezervation)
            db.session.commit()
            return {"message": "Rezervace has deleted successfully"}, 204
        else:
            return {"message": "Rezervace is not founded"}, 404
   

@app.route("/rezervace", methods=["POST"])
def rezervace_post():
    """
    function that handles adding rezervation
    """
    if request.method == "POST":
        data = request.form.to_dict()
        print(data)
        all_rezervations_lecturer = Rezervation.query.filter_by(lecturer_uuid=data.get("lecturer_uuid")).all()
        start_time = datetime.fromisoformat(data.get("start_time"))
        end_time = datetime.fromisoformat(data.get("end_time"))
        #if not all_rezervations_lecturer:
            #return {"message": "Lecturer is not founded"}, 400
        for one_rezervation in all_rezervations_lecturer:
            one_rezervation_start_time = datetime.fromisoformat(one_rezervation.start_time)
            one_rezervation_end_time = datetime.fromisoformat(one_rezervation.end_time)
            if (
            (one_rezervation_start_time > start_time
            and one_rezervation_start_time < end_time)
            or (one_rezervation_end_time > start_time
            and one_rezervation_end_time < end_time)
            ):
                return {"message": "Rezervace existuje"}, 400
        try:
            new_rezervace = Rezervation(**data)
            db.session.add(new_rezervace)
            db.session.commit()
            one_lecturer = Lecturer.query.filter_by(uuid=data.get('lecturer_uuid')).first()
            one_lecturer_schema = LecturerSchema()
            result = one_lecturer_schema.dump(one_lecturer)
            post_result = result.get("rezervation")
            return post_result, 200
        except(IntegrityError, DataError):
            return {"message": "Something went wrong"}, 400


if __name__ == '__main__':
    app.run(debug=True)
