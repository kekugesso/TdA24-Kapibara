import os
import json
from flask import Flask
import db

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


@app.route('/')
def hello_world():
    return "Hello TdA"


@app.route('/api')
def json_api():
    j = '{ "secret": "The cake is a lie"}'
    return json.loads(j)


if __name__ == '__main__':
    app.run(host=os.getenv("HOST"), port=os.getenv("PORT"))