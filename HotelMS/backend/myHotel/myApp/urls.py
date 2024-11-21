from django.urls import path
from .views import (
    login, sign_up,customer_details,add_booking,display_bookings
)

urlpatterns = [
    # Authentication and Customer Data Paths
    path('login/', login),
    path('sign_up/', sign_up),
    path('customer_details/', customer_details),
    path('add_booking/', add_booking),
    path('display_bookings/', display_bookings),
]
