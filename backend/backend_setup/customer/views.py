from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Sum
from django.db import transaction

from orders.models import Order, BillRequest, OrderItem
from waddlewait_app.models import Table
from assistance.models import Assistance
from orders.serializer import OrderSerializer, BillRequestSerializer, OrderItemSerializer
from assistance.serializer import AssistanceSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

@api_view(['POST'])
def createOrder(request):
    if request.method == 'POST':
        request_data = request.data # Form data sent in POST request
        table = request_data.get('table')
        items_data = request_data.get('items')
        
        if not table or not items_data: ## or not items_data:
            return JsonResponse({'message': 'Invalid input format'}, status=status.HTTP_400_BAD_REQUEST)
        
        total_bill = sum(float(item['price']) for item in items_data)
        request_data['bill'] =  total_bill

        order_data = {
            'table': table,
            'bill' : round(total_bill,2)
        }

        order_serializer = OrderSerializer(data=order_data)

        if order_serializer.is_valid():
            order_instance = order_serializer.save()  # Save the serializer

            allItems = []

            for item in items_data:
                item_id = item['id']

                existing_item = next((x for x in allItems if x['item'] == item_id), None)

                if existing_item:
                    existing_item['quantity'] += 1
                else:
                    allItems.append({
                        'order': order_instance.id,
                        'item': item_id,
                        'quantity': 1
                    })

            order_items_serializer = OrderItemSerializer(data=allItems, many = True)

            if order_items_serializer.is_valid():
                order_items_serializer.save()
            else:
                return JsonResponse({'message': 'Invalid item data'}, status=status.HTTP_400_BAD_REQUEST)

            return JsonResponse({"message": "Items added to order successfully",
                                 'total_amount': total_bill}, status=status.HTTP_201_CREATED)
        else: 
            print("no way")

            return JsonResponse({'message': 'Invalid order data'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def viewCustomerOrder(request, tableNumber):
    if request.method == 'GET':
        try:
            table = Table.objects.get(table=table)

            orders = Order.objects.filter(table=table)
            orders_serializer = OrderSerializer(orders, many = True)

            data = {
                'table': tableNumber,
                'orders': orders_serializer.data,
            }

            return JsonResponse(data)
        except:
            return JsonResponse({'message': 'Table number does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def viewPastOrderedItems(request, table):
    if request.method == 'GET':
        try:
            tableObj = Table.objects.get(table_number=table)
            
            orderItems= OrderItem.objects.filter(order__table=tableObj).order_by('pk')
            orderItems_serializer = OrderItemSerializer(orderItems, many = True)

            return Response(orderItems_serializer.data)  
        except:
            return JsonResponse({'message': 'Table number does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def requestCustomerAssistance(request):
    if request.method == 'POST':
        table = request.data.get('table')
        if table is None:
            return JsonResponse({'message': 'Invalid input format'}, status=status.HTTP_400_BAD_REQUEST)
        existingAssistance = Assistance.objects.filter(table=table, tableStatus=False).exists()
        if existingAssistance:
            return JsonResponse({'message': 'Assistance request for table already sent'}, status=status.HTTP_200_OK)

        assistance_serializer = AssistanceSerializer(data=request.data)
        if assistance_serializer.is_valid():
            assistance_serializer.save()
            return JsonResponse({ "message": "Assistance requested successfully"}, status=status.HTTP_201_CREATED)
        return JsonResponse({'message': 'Table number not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def requestCustomerBill(request):
    if request.method == 'POST':
        request_data = request.data
        table_id = request_data.get('table')
        
        if not table_id:
            return JsonResponse({'message': 'Invalid input format'}, status=status.HTTP_400_BAD_REQUEST)
        existingBillRequest = BillRequest.objects.filter(table_id=table_id, request_status=False).exists()
    
        if existingBillRequest:
            existingBillRequest = BillRequest.objects.filter(table_id=table_id, request_status=False).first()

            orders = Order.objects.filter(table=table_id)
            if not orders.exists():
              return JsonResponse({'message': 'No orders found for the table number'}, status=status.HTTP_404_NOT_FOUND)
            total_amount = orders.aggregate(total=Sum('bill'))['total']
            existingBillRequest.total_amount = total_amount
            existingBillRequest.save()
            return JsonResponse({'message': 'Bill request for table already sent, updated total amount'}, status=status.HTTP_200_OK)
        
        orders = Order.objects.filter(table=table_id)

        if not orders.exists():
            return JsonResponse({'message': 'No orders found for the table number'}, status=status.HTTP_404_NOT_FOUND)
        total_amount = orders.aggregate(total=Sum('bill'))['total']
        if total_amount is None:
            return JsonResponse({'message': 'No bill available for the table number'}, status=status.HTTP_404_NOT_FOUND)

        return_data = {
            'table_id' : table_id,
            'total_amount' : total_amount,
        }

        bill_serializer = BillRequestSerializer(data=return_data)

        if bill_serializer.is_valid():
            bill_serializer.save()
            return JsonResponse({'total_amount': total_amount, 
                'message': "Bill requested successfully"}, status=status.HTTP_201_CREATED)
        return JsonResponse({'message': 'Table number not found'}, status=status.HTTP_404_NOT_FOUND)