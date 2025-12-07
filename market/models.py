from django.db import models
from django.utils import timezone

# 1. Gold Price Model (XAU/EGP)
class GoldPriceHistory(models.Model):
    """Stores the price of 1 gram of Gold (XAU) in Egyptian Pounds (EGP)."""
    
    # Data Fields:
    price_egp = models.DecimalField(
        max_digits=12, 
        decimal_places=4, 
    )
    
    # Time Field:
    timestamp = models.DateTimeField(
        default=timezone.now, 
        db_index=True, 
    )

    # Language/Django Feature:
    def __str__(self):
        return f"Gold @ {self.price_egp} EGP on {self.timestamp.strftime('%Y-%m-%d %H:%M')}"

    # Meta Class:
    class Meta:
        verbose_name_plural = "Gold Price History"
        ordering = ['-timestamp']


# 2. Currency Rate Model (USD/EGP)
class CurrencyRateHistory(models.Model):
    """Stores the exchange rate between USD (Base) and EGP (Quote)."""
    
    # Data Fields:
    rate = models.DecimalField(
        max_digits=10, 
        decimal_places=4, 
    )
    
    # Time Field:
    timestamp = models.DateTimeField(
        default=timezone.now, 
        db_index=True, 
    )

    # Language/Django Feature:
    def __str__(self):
        return f"USD/EGP: {self.rate} on {self.timestamp.strftime('%Y-%m-%d %H:%M')}"

    # Meta Class:
    class Meta:
        verbose_name_plural = "Currency Rate History"
        ordering = ['-timestamp']