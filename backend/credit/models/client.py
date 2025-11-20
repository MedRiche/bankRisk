from mongoengine import Document, StringField, IntField, DateTimeField, ReferenceField
from django.conf import settings
import datetime

class Client(Document):
    user_id = StringField(required=False)  # pour stocker l'id utilisateur si besoin
    name = StringField(required=True, max_length=100)
    sex_status = StringField(max_length=10)   # ex: A91 / A92 / A93
    age_in_years = IntField(required=True)
    telephone = StringField(choices=['A191', 'A192'])
    foreign_worker = StringField(choices=['A201', 'A202'], default='A202')
    created_at = DateTimeField(default=datetime.datetime.utcnow)

    def __str__(self):
        return self.name
