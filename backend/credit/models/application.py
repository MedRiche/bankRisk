from mongoengine import Document, ReferenceField, StringField, DateTimeField
from .client import Client
import datetime

class Application(Document):
    client = ReferenceField(Client, reverse_delete_rule=2)  # CASCADE
    purpose = StringField(max_length=50, default="A40")
    credit_history = StringField(max_length=10, default="A30")
    submission_date = DateTimeField(default=datetime.datetime.utcnow)

    def __str__(self):
        return f"Application for {self.client.name}"
