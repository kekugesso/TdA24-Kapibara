from flask_restful import Resource
import uuid
from flask import request
from models import db, Lecturer, lecture_tag, Tags, Contacts


class LecturerResource(Resource):
    def get(self, lecturer_uuid):
        lecturer = Lecturer.query.filter_by(uuid=lecturer_uuid).first()
        if lecturer:
            return {"UUID": lecturer.uuid,  "title_before": lecturer.title_before, "first_name": lecturer.first_name, "middle_name": lecturer.middle_name, "last_name": lecturer.last_name, "title_after": lecturer.title_after, "picture_url": lecturer.picture_url, "location": lecturer.location,  "claim": lecturer.claim, "bio": lecturer.bio, 'tags': [{'uuid': tag.uuid, 'name': tag.name} for tag in lecturer.tags], "price_per_hour": lecturer.price_per_hour, "contact": {"telephone_numbers": [lecturer.contacts.phone1, lecturer.contacts.phone2], "emails": [lecturer.contacts.email1, lecturer.contacts.email2]}}, 200
        else:
            return {'message': 'Lecturer not found'}, 404

    def post(self):
        data = request.get_json()
        new_lecturer = Lecturer(
            uuid=str(uuid.uuid4()),
            title_before=data.get('title_before'),
            first_name=data.get('first_name'),
            middle_name=data.get('middle_name'),
            last_name=data.get('last_name'),
            title_after=data.get('title_after'),
            picture_url=data.get('picture_url'),
            location=data.get('location'),
            claim=data.get('claim'),
            bio=data.get('bio'),
            price_per_hour=data.get('price_per_hour')
        )
        db.session.add(new_lecturer)
        db.session.commit()
        return {'message': 'Lecturer added successfully'}, 201

    def put(self, lecturer_uuid):
        lecturer = Lecturer.query.filter_by(uuid=lecturer_uuid).first()
        if lecturer:
            data = request.get_json()
            lecturer.title_before = data.get('title_before')
            lecturer.first_name = data.get('first_name')
            lecturer.middle_name = data.get('middle_name')
            lecturer.last_name = data.get('last_name')
            lecturer.title_after = data.get('title_after')
            lecturer.picture_url = data.get('picture_url')
            lecturer.location = data.get('location')
            lecturer.claim = data.get('claim')
            lecturer.bio = data.get('bio')
            lecturer.price_per_hour = data.get('price_per_hour')
            db.session.commit()
            return {'message': 'Lecturer updated successfully'}, 200
        else:
            return {'message': 'Lecturer not found'}, 404

    def delete(self, lecturer_uuid):
        lecturer = Lecturer.query.filter_by(uuid=lecturer_uuid).first()
        if lecturer:
            db.session.delete(lecturer)
            db.session.commit()
            return {'message': 'Lecturer deleted successfully'}, 200
        else:
            return {'message': 'Lecturer not found'}, 404
