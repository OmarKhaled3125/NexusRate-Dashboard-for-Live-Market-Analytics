from celery import shared_task
import requests
from decimal import Decimal, getcontext
from .models import GoldPriceHistory, CurrencyRateHistory

getcontext().prec = 80 

CURRENCY_API_KEY = 'db0aba73b74c233a6ace5314' 
METALS_API_KEY = 'b89119aa938e4814000c154c8f028d94'

TROY_OUNCE_TO_GRAM = Decimal('31.1035')


@shared_task
def fetch_and_calculate_market_data():
    """
    Fetches USD/EGP rate and XAU/USD price, calculates XAU/EGP (per gram), 
    and saves both records to the PostgreSQL database.
    """
    currency_url = f"https://v6.exchangerate-api.com/v6/{CURRENCY_API_KEY}/latest/USD"
    
    currency_response = requests.get(currency_url)
    currency_response.raise_for_status() 
    currency_data = currency_response.json()
    
    usd_egp_rate = Decimal(str(currency_data['conversion_rates']['EGP'])) 
    
    CurrencyRateHistory.objects.create(rate=usd_egp_rate)
    print(f"Saved USD/EGP Rate: {usd_egp_rate}")

    metals_url = f"https://api.metalpriceapi.com/v1/latest?api_key={METALS_API_KEY}&base=USD&currencies=XAU"
    
    metals_response = requests.get(metals_url)
    metals_response.raise_for_status()
    metals_data = metals_response.json()
    
    # API returns "How much XAU you get for 1 USD" (e.g. 0.00038)
    # So, Price of 1 Ounce of Gold in USD = 1 / rate
    xau_rate = Decimal(str(metals_data['rates']['XAU']))
    xau_usd_ounce_price = Decimal(1) / xau_rate

    xau_egp_ounce_price = xau_usd_ounce_price * usd_egp_rate
    
    xau_egp_gram_price = xau_egp_ounce_price / TROY_OUNCE_TO_GRAM
    
    final_gold_egp_price = xau_egp_gram_price.quantize(Decimal('0.0001'))

    GoldPriceHistory.objects.create(price_egp=final_gold_egp_price)
    print(f"Saved Gold Price (per gram): {final_gold_egp_price} EGP")

    return "Market data fetched and saved successfully."