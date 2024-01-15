from marshmallow import Schema, fields


class TagSchema(Schema):
    uuid = fields.String()
    name = fields.String()

class ContactSchema(Schema):
    telephone_numbers = fields.List(fields.String())
    emails = fields.List(fields.String())


class LecturerSchema(Schema):
    contact = fields.Nested(ContactSchema)
    tags = fields.Nested(TagSchema, many=True)

    class Meta:
        fields = ["uuid", "title_before", "first_name", "middle_name", "last_name", "title_after", "picture_url", "location", "claim", "bio", "price_per_hour", "tags", "contact"]
    