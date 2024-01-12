from marshmallow import Schema, fields


class ContactSchema(Schema):
    telephone_numbers = fields.List(fields.String())
    emails = fields.List(fields.String())


class LecturerSchema(Schema):
    contact = fields.Nested(ContactSchema)

    class Meta:
        fields = ["id", "title_before", "first_name", "middle_name", "last_name", "title_after", "picture_url", "location", "claim", "bio", "price_per_hour", "tags", "contact"]
    