from rest_framework import generics
from django.utils import timezone
from datetime import timedelta
from .models import GoldPriceHistory, CurrencyRateHistory
from .serializers import GoldPriceSerializer, CurrencyRateSerializer
from .tasks import fetch_and_calculate_market_data

def update_market_data_if_stale():
    """
    Checks if the latest data is older than 5 minutes.
    If so, runs the fetch logic synchronously (for Serverless/Demo compatibility).
    """
    last_gold = GoldPriceHistory.objects.order_by('-timestamp').first()
    
    should_update = False
    if not last_gold:
        should_update = True
    else:
        # Check if older than 5 minutes (300 seconds)
        if timezone.now() - last_gold.timestamp > timedelta(seconds=300):
            should_update = True
            
    if should_update:
        print("Data is stale (Serverless Mode). Fetching new data...")
        try:
            fetch_and_calculate_market_data() # Call the function directly, not as a task
        except Exception as e:
            print(f"Error fetching data: {e}")

# 1. Gold Price List View
class GoldPriceListView(generics.ListAPIView):
    """API view to fetch the list of historical gold prices."""
    
    serializer_class = GoldPriceSerializer

    def get_queryset(self):
        # Trigger update if needed before returning data
        update_market_data_if_stale()
        return GoldPriceHistory.objects.all().order_by('-timestamp')


# 2. Currency Rate List View
class CurrencyRateListView(generics.ListAPIView):
    """API view to fetch the list of historical currency rates (USD/EGP)."""
    
    serializer_class = CurrencyRateSerializer

    def get_queryset(self):
        # Trigger update if needed
        update_market_data_if_stale()
        return CurrencyRateHistory.objects.all().order_by('-timestamp')