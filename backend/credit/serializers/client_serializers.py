# credit/serializers/client_serializer.py
from rest_framework import serializers
from credit.models.client import Client
from credit.models.employment import Employment
from credit.models.financial import Financial
from credit.models.property import Property
from credit.serializers.application_serializers import ApplicationSerializer


class EmploymentSerializer(serializers.Serializer):
    employment_status = serializers.CharField()
    job_type = serializers.CharField()
    existing_credits_no = serializers.IntegerField()
    client = serializers.CharField()


class FinancialSerializer(serializers.Serializer):
    checking_account_status = serializers.CharField()
    savings_account_bonds = serializers.CharField()
    credit_amount = serializers.FloatField()
    duration_in_month = serializers.IntegerField()
    installment = serializers.IntegerField()
    other_debtors = serializers.CharField()
    client = serializers.CharField()


class PropertySerializer(serializers.Serializer):
    property_type = serializers.CharField()
    housing = serializers.CharField()
    other_installment_plans = serializers.CharField()
    liability_responsibles = serializers.IntegerField()
    client = serializers.CharField()


class ClientSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    sex_status = serializers.CharField()
    age_in_years = serializers.IntegerField()
    telephone = serializers.CharField()
    foreign_worker = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)

    # Relations imbriquées
    employment = EmploymentSerializer(read_only=True)
    financial = FinancialSerializer(read_only=True)
    property = PropertySerializer(read_only=True)
    applications = ApplicationSerializer(many=True, read_only=True)

    def to_representation(self, instance):
        """Personnalise la sortie JSON pour MongoEngine"""
        data = {
            "id": str(instance.id),
            "name": instance.name,
            "sex_status": instance.sex_status,
            "age_in_years": instance.age_in_years,
            "telephone": instance.telephone,
            "foreign_worker": instance.foreign_worker,
            "created_at": instance.created_at.isoformat() if instance.created_at else None,
            "employment": None,
            "financial": None,
            "property": None,
            "applications": []
        }

        # Employment lié
        emp = Employment.objects(client=instance).first()
        if emp:
            data['employment'] = EmploymentSerializer(emp).data

        # Financial lié
        fin = Financial.objects(client=instance).first()
        if fin:
            data['financial'] = FinancialSerializer(fin).data

        # Property lié
        prop = Property.objects(client=instance).first()
        if prop:
            data['property'] = PropertySerializer(prop).data

        # Applications liées
        apps = instance.applications if hasattr(instance, 'applications') else []
        data['applications'] = [ApplicationSerializer(a).data for a in apps]

        return data
