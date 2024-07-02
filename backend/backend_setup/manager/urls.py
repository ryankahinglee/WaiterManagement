from django.urls import path
from . import views

urlpatterns = [
    path('sales/history ', views.sales_history, name='sales_history'),
]