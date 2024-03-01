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
from flask_httpauth import HTTPBasicAuth
from flask_basicauth import BasicAuth
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
#auth = HTTPBasicAuth()

app.config['AUTH_USERNAME'] = 'TdA'
app.config['AUTH_PASSWORD'] = 'd8Ef6!dGG_pv'

#basic_auth = BasicAuth(app)

users = {
    "TdA": "d8Ef6!dGG_pv",
}


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


@app.route('/api/lecturers', methods = ["GET", "POST"])
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
        except (DataError, IntegrityError) as e:
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
            
        except (IntegrityError, DataError, AttributeError):
            db.session.delete(new_lecturer)
            db.session.commit()
            return {'message' : "This values cant be a null"}, 400
        created_lecturer = Lecturer.query.filter_by(uuid=lecturer_uuid).first()
        lecturer_schema = LecturerSchema()
        result = lecturer_schema.dump(created_lecturer)
        return result, 200
    elif request.method == "GET":
        lecturers = Lecturer.query.all()
        lecturer_schema = LecturerSchema(many=True)
        result = lecturer_schema.dump(lecturers)
        return result, 200


@app.route('/', methods = ["GET"])  # title page
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



@app.route('/api/lecturers/<uuid1>', methods = ["GET", "DELETE", "PUT"])
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
            except(IntegrityError, DataError, AttributeError):
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

@app.route('/lecturer/<uuid1>', methods = ["GET"])  # Lecturer - spesific
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
            rezervace_schema = RezervationSchema()
            result = rezervace_schema.dump(rezervation)
            return render_template("rezervace.html", rezervace=result), 200
        else:
            return render_template("rezervace.html"), 404
    elif request.method == "DELETE":
        rezervation = Rezervation.query.filter_by(id=id_rezrvace).first()
        if rezervation:
            db.session.delete(rezervation)
            db.session.commit()
            return {"message": "Rezervace has deleted successfully"}, 204
        else:
            return {"message": "Rezervace is not founded"}, 404
   

@app.route("/rezervace", methods=["GET","POST"])
def rezervace_post():
    """
    function that handles adding rezervation
    """
    if request.method == "POST":
        neexistuje = True
        data = request.get_json()
        all_rezervations_lecturer = Rezervation.query.filter_by(lecturer_uuid=data.get("lecturer_uuid")).all()
        start_time = datetime.fromisoformat(data.get("start_time"))
        end_time = datetime.fromisoformat(data.get("end_time"))
        if start_time > end_time:
            return {"message": "Start time is bigger than end time"}, 400
        #if not all_rezervations_lecturer:
            #return {"message": "Lecturer is not founded"}, 400
        for one_rezervation in all_rezervations_lecturer:
            one_rezervation_start_time = datetime.fromisoformat(one_rezervation.start_time)
            one_rezervation_end_time = datetime.fromisoformat(one_rezervation.end_time)
            if (
            (start_time > one_rezervation_start_time
            and start_time < one_rezervation_end_time)
            or (end_time > one_rezervation_start_time
            and end_time < one_rezervation_end_time)
            or (start_time == one_rezervation_start_time
            and end_time == one_rezervation_end_time)
            ):
                neexistuje = False
                flash("Rezervace existuje")
        if neexistuje:
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
        else:
            return {"message": "Rezervace existuje"}, 400
    elif request.method == "GET":
        data = request.args.get("lecturer")
        one_lecturer = Lecturer.query.filter_by(uuid=data).first()
        one_lecturer_schema = LecturerSchema()
        result = one_lecturer_schema.dump(one_lecturer)
        tags = result.get("tags")
        return render_template("rezervovani.html", tags=tags), 200


@app.route("/lecturer/<uuid>/download", methods=["GET"])
def download(uuid):
    """
    function that handles download calendar
    """
    one_lecturer = Lecturer.query.filter_by(uuid=uuid).first()
    one_lecturer_schema = LecturerSchema()
    result = one_lecturer_schema.dump(one_lecturer)
    data = result.get("rezervation")
    cal = icalendar.Calendar()
    for rezervace in data:
        event = icalendar.Event()
        event.add('summary', rezervace.get("subject"))
        event.add('dtstart', datetime.fromisoformat(rezervace.get("start_time")))
        event.add('dtend', datetime.fromisoformat(rezervace.get("end_time")))
        event.add("description", rezervace.get("notes"))
        event.add('organizer', result.get("email"))
        event.add("attendee", rezervace.get("email_student"))
        event.add('location', rezervace.get("location"))
        cal.add_component(event)
    with open('instance/rezervace.ical', 'wb') as f:
        f.write(cal.to_ical())
    return send_file("../instance/rezervace.ical", as_attachment=True)

@app.route('/import/<id_rezervace>', methods=["GET"])
@login_required
def import_google_calendar(id_rezervace):
    """
    function that handles import google calendar
    """
    one_rezervace = Rezervation.query.filter_by(id=id_rezervace).first()
    if current_user.uuid == one_rezervace.lecturer_uuid:
        base_url = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
        start_time = one_rezervace.start_time.replace('-', '', 2)
        start_time = start_time.replace(":", "", 2)
        end_time = one_rezervace.end_time.replace('-', '', 2)
        end_time = end_time.replace(":", "", 2)
        parameters = {
            'text': one_rezervace.subject,
            'dates': f'{start_time}/{end_time}',
            'details': one_rezervace.notes,
            'add': one_rezervace.email_student,
            'location': one_rezervace.location,
            'ctz': 'Europe/Prague'
        }
        url = base_url + '&' + '&'.join([f'{key}={value}' for key, value in parameters.items()])
        webbrowser.open(url)
        return render_template("redirect.html", url=url_for(f"/lecturer/{one_rezervace.lecturer_uuid}/admin")), 200
    else:
        return {"message": "naaaaaaaah bro"}, 401

if __name__ == '__main__':
    app.run(debug=True)
