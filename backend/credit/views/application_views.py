# backend/credit/views/application_views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models.application import CreditApplication
from ..models.client import Client
from ..serializers.application_serializers import CreditApplicationSerializer
import datetime

class CreditApplicationViewSet(viewsets.ViewSet):
    """CRUD pour les demandes de crédit"""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Liste toutes les demandes"""
        applications = CreditApplication.objects.all()
        serializer = CreditApplicationSerializer(applications, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Récupère une demande par ID"""
        try:
            application = CreditApplication.objects.get(id=pk)
            serializer = CreditApplicationSerializer(application)
            return Response(serializer.data)
        except CreditApplication.DoesNotExist:
            return Response(
                {"error": "Demande non trouvée"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def by_client(self, request):
        """Récupère les demandes d'un client"""
        client_id = request.query_params.get('client_id')
        if not client_id:
            return Response(
                {"error": "client_id requis"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            client = Client.objects.get(id=client_id)
            applications = CreditApplication.objects(client=client)
            serializer = CreditApplicationSerializer(applications, many=True)
            return Response(serializer.data)
        except Client.DoesNotExist:
            return Response(
                {"error": "Client non trouvé"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def create(self, request):
        """Crée une nouvelle demande de crédit"""
        data = request.data.copy()
        
        # Récupérer ou créer le client
        user_email = request.user.email if hasattr(request, 'user') else None
        
        try:
            # Essayer de récupérer le client existant
            if 'client_id' in data:
                client = Client.objects.get(id=data['client_id'])
            elif user_email:
                try:
                    client = Client.objects.get(user_email=user_email)
                except Client.DoesNotExist:
                    # Créer un nouveau client si nécessaire
                    client = Client(
                        user_email=user_email,
                        age=data.get('age', 30),
                        sex=data.get('sex', 'male'),
                        job=data.get('job', 2),
                        housing=data.get('housing', 'rent'),
                        saving_accounts=data.get('saving_accounts', 'NA'),
                        checking_account=data.get('checking_account', 'NA')
                    )
                    client.save()
            else:
                return Response(
                    {"error": "Client requis"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Créer la demande
            data['client'] = str(client.id)
            serializer = CreditApplicationSerializer(data=data)
            
            if serializer.is_valid():
                application = serializer.save()
                return Response(
                    CreditApplicationSerializer(application).data,
                    status=status.HTTP_201_CREATED
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def evaluate(self, request, pk=None):
        """Évalue une demande (Admin seulement)"""
        try:
            application = CreditApplication.objects.get(id=pk)
            
            # Mettre à jour le statut
            application.status = request.data.get('status', application.status)
            application.risk = request.data.get('risk', application.risk)
            application.risk_score = request.data.get('risk_score', application.risk_score)
            application.evaluator_comment = request.data.get('evaluator_comment', '')
            application.evaluation_date = datetime.datetime.utcnow()
            application.save()
            
            serializer = CreditApplicationSerializer(application)
            return Response(serializer.data)
            
        except CreditApplication.DoesNotExist:
            return Response(
                {"error": "Demande non trouvée"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def destroy(self, request, pk=None):
        """Supprime une demande"""
        try:
            application = CreditApplication.objects.get(id=pk)
            application.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CreditApplication.DoesNotExist:
            return Response(
                {"error": "Demande non trouvée"},
                status=status.HTTP_404_NOT_FOUND
            )