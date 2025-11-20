# credit/views/application_views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models.application import Application
from ..serializers.application_serializers import ApplicationSerializer

class ApplicationViewSet(viewsets.ViewSet):
    """ViewSet pour Application avec MongoEngine"""

    def list(self, request):
        applications = Application.objects.all()
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            application = Application.objects.get(id=pk)
        except Application.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)

    def create(self, request):
        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            application = serializer.save()
            return Response(ApplicationSerializer(application).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            application = Application.objects.get(id=pk)
        except Application.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            for attr, value in serializer.validated_data.items():
                setattr(application, attr, value)
            application.save()
            return Response(ApplicationSerializer(application).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            application = Application.objects.get(id=pk)
        except Application.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

        application.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
