import os
import json
from flask import *
from flask_restful import Api
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

@app.before_request
def before_request():
    db.create_all()

@app.route('/')  # title page
def title():
    return render_template('index.html')


@app.route('/api')  # api
def json_api():
    return json.dumps('{ "secret": "The cake is a lie"}')


@app.route('/lecturer', methods = ["GET", "POST"])  # lecturer
def lecturer_static():
    data = json.load(open('app/static/json/lecturer.json', 'r'))
    return render_template('lecturer.html', data=data)



@app.route('/lecturer/<uuid>', methods = ["GET", "PUT", "DELETE"])  # Lecturer - spesific
def lecturer_specific(uuid):
    if request.method == "GET":
        lecturer = Lecturer.query.filter_by(uuid=uuid).first()
        if lecturer:
            lecturer_schema = LecturerSchema()
            result = lecturer_schema.dump(lecturer)
            return render_template('lecturer.html', lecturer_uuid=uuid, data=result)
        else:
            return {'message': "Lector is not founded"}, 404
    elif request.method == "DELETE":
        db.session.delete(Lecturer.query.get(uuid))
        db.session.commit()
        return {'message': 'Lecturer has deleted successfully'}, 200

if __name__ == '__main__':
    app.run(debug=True)
