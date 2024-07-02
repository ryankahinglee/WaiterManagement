from django.urls import path
from . import views

urlpatterns = [
    path('pending', views.pendingOrders, name='pending-orders'),
    path('new', views.newestOrder, name='order-request'),
    path('completed', views.completedOrders, name='completed-orders'),
    path('reset/<int:orderId>/<int:itemId>', views.markItemAsNotStarted, name = 'reset-item'),
    path('prepare/<int:orderId>/<int:itemId>', views.markItemAsPreparing, name='preparing-item'),
    path('ready/<int:orderId>/<int:itemId>', views.markItemAsReady, name='ready-item'),
    path('complete/<int:orderId>', views.completeOrder, name='complete-order'),
]
