from rest_framework import serializers
from waddlewait_app.models import Table
from .models import Order, OrderItem, BillRequest
from waddlewait_app.serializers import TableSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem

        fields = [
            'id',
            'order',
            'item',
            'name',
            'price',
            'quantity',
            'status'
        ]
    
    def get_name(self, obj):
        return obj.item.name
    
    def get_status(self, obj):
        if obj.is_ready:
            return "Ready"
        elif obj.is_preparing:
            return "Preparing"
        else:
            return "Pending"

    def get_price(self, obj):
        return obj.item.price * obj.quantity
        
class OrderSerializer(serializers.ModelSerializer):
    formatted_time = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id',
                  'created_at',
                  'formatted_time',
                  'table',
                  'is_complete',
                  'bill']
        read_only_fields = ['created_at']

    def get_formatted_time(self, obj):
        return obj.created_at.strftime('%d %B %H:%M:%S')

class BillRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = BillRequest
        fields = ['id',
                  'table_id',
                  'total_amount',
                  'staff_name',
                  'request_status',
                  ]