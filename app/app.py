import os
import json
from flask import *
from flask_restful import Api
from models import db, Lecturer, Tags, Contacts, lecture_tag
from api import LecturerResource
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
#api.add_resource(LecturerResource, '/api/lecturer/<string:lecturer_uuid>')


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


@app.route('/lecturer')  # lecturer
def lecturer_static():
    data = json.load(open('app/static/json/lecturer.json', 'r'))
    return render_template('lecturer.html', data=data)



@app.route('/lecturer/<uuid>')  # Lecturer - spesific
def lecturer_specific(uuid):
    data = json.load(open('app/static/json/lecturer.json', 'r'))
    return render_template('lecturer.html', lecturer_uuid=uuid, data=data)


if __name__ == '__main__':
    app.run(debug=True)
