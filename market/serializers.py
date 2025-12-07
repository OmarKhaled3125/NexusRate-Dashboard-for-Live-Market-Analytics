from rest_framework import serializers
from .models import GoldPriceHistory, CurrencyRateHistory

# 1. Gold Price Serializer
class GoldPriceSerializer(serializers.ModelSerializer):
    """Translates the GoldPriceHistory model data into JSON format."""
    class Meta:
        model = GoldPriceHistory
        fields = ('id', 'price_egp', 'timestamp') 
        read_only_fields = ('price_egp', 'timestamp') 

# 2. Currency Rate Serializer
class CurrencyRateSerializer(serializers.ModelSerializer):
    """Translates the CurrencyRateHistory model data into JSON format."""
    class Meta:
        model = CurrencyRateHistory
        fields = ('id', 'rate', 'timestamp')
        read_only_fields = ('rate', 'timestamp')