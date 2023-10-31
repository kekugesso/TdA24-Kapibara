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
    ip = request.remote_addr
    return render_template('index.html', user_ip=ip)


@app.route('/api')  # api
def json_api():
    return json.dumps('{ "secret": "The cake is a lie"}')


@app.route('/lecturer')  # api
def return_title():
    redirect(url_for('title'))
    return render_template('lecturer.html')


@app.route('/lecturer/<uuid>')  # api
def lecturer_specific(uuid):
    return render_template('lecturer.html', lecturer_uuid=uuid)


if __name__ == '__main__':
    app.run(debug=True)
