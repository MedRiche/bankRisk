from rest_framework import serializers
from ..models.application import Application
from ..models.property import Property
from ..models.employment import Employment


class PropertySerializer(serializers.Serializer):
    property_type = serializers.CharField()
    housing = serializers.CharField()
    other_installment_plans = serializers.CharField()
    liability_responsibles = serializers.IntegerField()


class EmploymentSerializer(serializers.Serializer):
    employment_status = serializers.CharField()
    job_type = serializers.CharField()
    existing_credits_no = serializers.IntegerField()


class ApplicationSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    client = serializers.CharField()
    purpose = serializers.CharField()
    credit_history = serializers.CharField()
    submission_date = serializers.DateTimeField(read_only=True)

    # Données imbriquées (création seulement)
    property_data = PropertySerializer(write_only=True)
    employment_data = EmploymentSerializer(write_only=True)

    def create(self, validated_data):
        # Extraire les sous-documents
        property_data = validated_data.pop('property_data')
        employment_data = validated_data.pop('employment_data')

        # Créer l’application
        application = Application(**validated_data)
        application.save()

        # Créer la propriété et l’emploi liés au même client
        Property(client=application.client, **property_data).save()
        Employment(client=application.client, **employment_data).save()

        return application

    def to_representation(self, instance):
        """Personnalise la réponse JSON renvoyée"""
        return {
            'id': str(instance.id),
            'client': str(instance.client.id) if instance.client else None,
            'purpose': instance.purpose,
            'credit_history': instance.credit_history,
            'submission_date': instance.submission_date.isoformat() if instance.submission_date else None,
        }
