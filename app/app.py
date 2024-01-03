import os
import json
import uuid
from flask import *
from models import db, Lecturer, Tags, Contacts, lecture_tag
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
    return json.dumps({'secret': 'The cake is a lie'})

@app.route('/lecturer')  # lecturer
def lecturer_static():
    lecturers_data = Lecturer.query.first()
    return render_template('lecturer.html', data=lecturers_data)

@app.route('/lecturer/<int:lecturer_id>')  # Lecturer - specific
def lecturer_specific(lecturer_id):
    lecturer_data = Lecturer.query.get(lecturer_id)
    return render_template('lecturer.html', lecturer=lecturer_data)

@app.route('/test', methods=['POST', 'GET'])
def test():
    if request.method == "POST":
        new_uuid = str(uuid.uuid4())
        try:
            new_lecturer = Lecturer(
                uuid = new_uuid,
                title_before=request.form['title_before'],
                first_name=request.form['first_name'],
                middle_name=request.form['middle_name'],
                last_name=request.form['last_name'],
                title_after=request.form['title_after'],
                picture_url=request.form['picture_url'],
                location=request.form['location'],
                claim=request.form['claim'],
                bio=request.form['bio'],
                price_per_hour=int(request.form['price_per_hour'])
            )
            db.session.add(new_lecturer)
            db.session.commit()
        except Exception as e:
            # Обработка исключения при возникновении ошибки
            return f"Error: {str(e)}"

    return render_template('test.html')

if __name__ == '__main__':
    app.run(debug=True)
