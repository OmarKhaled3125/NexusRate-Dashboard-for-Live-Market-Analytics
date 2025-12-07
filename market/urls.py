from django.urls import path
from .views import GoldPriceListView, CurrencyRateListView

urlpatterns = [
    # Path: /api/gold-history/
    path('gold-history/', GoldPriceListView.as_view(), name='gold-history'),
    
    # Path: /api/currency-history/
    path('currency-history/', CurrencyRateListView.as_view(), name='currency-history'),
]