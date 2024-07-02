from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Sum

from collections import defaultdict, Counter
from orders.models import OrderItem
from orders.serializer import OrderSerializer, BillRequestSerializer, OrderItemSerializer
from assistance.serializer import AssistanceSerializer
from waddlewaitMenu.models import MenuItem

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
# Create your views here.


@api_view(['GET'])
def sales_history(request):
    if request.method == 'GET':
        sales_dictionary = {}
        sales_dictionary_list = []
        order_items = OrderItem.objects.all()
        order_items_serializer = OrderItemSerializer(order_items, many = True)
        for order in order_items_serializer.data:
            if order['item'] in sales_dictionary.keys():
                sales_dictionary[order['item']] = order['quantity'] + sales_dictionary[order['item']]
            else:
                sales_dictionary[order['item']] = order['quantity']

        for entry in sales_dictionary:
            menu_item = MenuItem.objects.get(pk = entry)
            price = menu_item.price
            dict_to_add = {
                "item_id" : entry,
                "total_sold": sales_dictionary[entry],
                "total_sales": sales_dictionary[entry] * price,
            }
            sales_dictionary_list.append(dict_to_add)

        return JsonResponse({'sales': sales_dictionary_list})