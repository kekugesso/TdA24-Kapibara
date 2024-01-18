from marshmallow import Schema, fields


class TagSchema(Schema):
    name = fields.String()

class ContactSchema(Schema):
    telephone_numbers = fields.List(fields.String())
    emails = fields.List(fields.String())


class LecturerSchema(Schema):
    contact = fields.Nested(ContactSchema)
    tags = fields.Method("get_tag_names")

    def get_tag_names(self, lecturer):
        if lecturer.tags:
            return [tag.name for tag in lecturer.tags]
        return []

    class Meta:
        fields = ["uuid", "title_before", "first_name", "middle_name", "last_name", "title_after", "picture_url", "location", "claim", "bio", "price_per_hour", "tags", "contact"]
    