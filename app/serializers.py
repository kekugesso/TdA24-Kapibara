"""
module that contains the serializers
"""
from marshmallow import Schema, fields

class RezervationSchema(Schema):
    """
    Schema for the rezervation model
    """
    id = fields.Integer()
    date = fields.String()
    start_time = fields.Integer()
    end_time = fields.Integer()
    first_name_student = fields.String()
    last_name_student = fields.String()
    email_student = fields.String()
    number_student = fields.String()
    notes = fields.String()
    subject = fields.String()
    lecturer_uuid = fields.String()

class TagSchema(Schema):
    """
    Schema for the tag model
    """
    name = fields.String()

class ContactSchema(Schema):
    """
    Schema for the contact model
    """
    telephone_numbers = fields.List(fields.String())
    emails = fields.List(fields.String())


class LecturerSchema(Schema):
    """
    Schema for the contact model
    """
    contact = fields.Nested(ContactSchema)
    tags = fields.List(fields.Nested(TagSchema))
    rezervation = fields.List(fields.Nested(RezervationSchema))

    class Meta:
        """
        Class Meta
        """
        fields = [
        "uuid",
        "title_before",
        "first_name",
        "middle_name",
        "last_name",
        "title_after",
        "picture_url",
        "location",
        "claim",
        "bio",
        "price_per_hour",
        "tags",
        "contact",
        "rezervation"
        ]
