import os
import json
from flask import *
# Flask, request, url_for, redirect, render_template
from . import db

app = Flask(__name__)

app.config.from_mapping(
    DATABASE=os.path.join(app.instance_path, 'tourdeflask.sqlite'),
)

# ensure the instance folder exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass

db.init_app(app)


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
