# credit/views/client_views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models.client import Client
from ..models.employment import Employment
from ..models.financial import Financial
from ..models.property import Property
from ..serializers.client_serializers import (
    ClientSerializer,
    EmploymentSerializer,
    FinancialSerializer,
    PropertySerializer
)


class ClientViewSet(viewsets.ViewSet):
    """CRUD pour Client"""

    def list(self, request):
        clients = Client.objects.all()
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            client = Client.objects.get(id=pk)
        except Client.DoesNotExist:
            return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ClientSerializer(client)
        return Response(serializer.data)

    def create(self, request):
        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
            client = serializer.save()
            return Response(ClientSerializer(client).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            client = Client.objects.get(id=pk)
        except Client.DoesNotExist:
            return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
            for attr, value in serializer.validated_data.items():
                setattr(client, attr, value)
            client.save()
            return Response(ClientSerializer(client).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            client = Client.objects.get(id=pk)
        except Client.DoesNotExist:
            return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)

        client.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class EmploymentViewSet(viewsets.ViewSet):
    """CRUD pour Employment"""

    def list(self, request):
        employments = Employment.objects.all()
        serializer = EmploymentSerializer(employments, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            emp = Employment.objects.get(id=pk)
        except Employment.DoesNotExist:
            return Response({"error": "Employment not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = EmploymentSerializer(emp)
        return Response(serializer.data)

    def create(self, request):
        serializer = EmploymentSerializer(data=request.data)
        if serializer.is_valid():
            emp = serializer.save()
            return Response(EmploymentSerializer(emp).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            emp = Employment.objects.get(id=pk)
        except Employment.DoesNotExist:
            return Response({"error": "Employment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = EmploymentSerializer(data=request.data)
        if serializer.is_valid():
            for attr, value in serializer.validated_data.items():
                setattr(emp, attr, value)
            emp.save()
            return Response(EmploymentSerializer(emp).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            emp = Employment.objects.get(id=pk)
        except Employment.DoesNotExist:
            return Response({"error": "Employment not found"}, status=status.HTTP_404_NOT_FOUND)
        emp.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class FinancialInfoViewSet(viewsets.ViewSet):
    """CRUD pour Financial"""

    def list(self, request):
        financials = Financial.objects.all()
        serializer = FinancialSerializer(financials, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            fin = Financial.objects.get(id=pk)
        except Financial.DoesNotExist:
            return Response({"error": "Financial info not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = FinancialSerializer(fin)
        return Response(serializer.data)

    def create(self, request):
        serializer = FinancialSerializer(data=request.data)
        if serializer.is_valid():
            fin = serializer.save()
            return Response(FinancialSerializer(fin).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            fin = Financial.objects.get(id=pk)
        except Financial.DoesNotExist:
            return Response({"error": "Financial info not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = FinancialSerializer(data=request.data)
        if serializer.is_valid():
            for attr, value in serializer.validated_data.items():
                setattr(fin, attr, value)
            fin.save()
            return Response(FinancialSerializer(fin).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            fin = Financial.objects.get(id=pk)
        except Financial.DoesNotExist:
            return Response({"error": "Financial info not found"}, status=status.HTTP_404_NOT_FOUND)
        fin.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class PropertyViewSet(viewsets.ViewSet):
    """CRUD pour Property"""

    def list(self, request):
        properties = Property.objects.all()
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            prop = Property.objects.get(id=pk)
        except Property.DoesNotExist:
            return Response({"error": "Property not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PropertySerializer(prop)
        return Response(serializer.data)

    def create(self, request):
        serializer = PropertySerializer(data=request.data)
        if serializer.is_valid():
            prop = serializer.save()
            return Response(PropertySerializer(prop).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            prop = Property.objects.get(id=pk)
        except Property.DoesNotExist:
            return Response({"error": "Property not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PropertySerializer(data=request.data)
        if serializer.is_valid():
            for attr, value in serializer.validated_data.items():
                setattr(prop, attr, value)
            prop.save()
            return Response(PropertySerializer(prop).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            prop = Property.objects.get(id=pk)
        except Property.DoesNotExist:
            return Response({"error": "Property not found"}, status=status.HTTP_404_NOT_FOUND)
        prop.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
