from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.client_views import ClientViewSet, EmploymentViewSet, FinancialInfoViewSet, PropertyViewSet
from .views.application_views import ApplicationViewSet
from .views.scoring_views import ScoringViewSet

router = DefaultRouter()

# Clients et sous-objets
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'employments', EmploymentViewSet, basename='employment')
router.register(r'financials', FinancialInfoViewSet, basename='financial')
router.register(r'properties', PropertyViewSet, basename='property')

router.register(r'applications', ApplicationViewSet, basename='application')

router.register(r'scorings', ScoringViewSet, basename='scoring')

urlpatterns = [
    path('', include(router.urls)),
]
