from django.shortcuts import render
from django.http import JsonResponse
from .models import Table
from assistance.models import Assistance
from .serializers import TableSerializer, TableBookingSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

@api_view(['GET', 'POST'])
def table_list(request):

    if request.method == 'GET':
        #gets all the tables as json
        tables = Table.objects.all()
        tables_serializer = TableSerializer(tables, many = True) #serializes table list
        return JsonResponse(tables_serializer.data, safe = False)
    if request.method == 'POST':
        tables_serializer = TableSerializer(data = request.data) #serializes table list
        if tables_serializer.is_valid():
            tables_serializer.save()
            return Response(tables_serializer.data, status = status.HTTP_201_CREATED)



@api_view(['GET', 'PUT'])
def table_detail(request, table_number):
    try:
        print(Table.objects)
        table = Table.objects.get(pk = table_number)
    except Table.DoesNotExist:
        return Response(str(Table.objects.values_list('pk', flat=True)),status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TableSerializer(table)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer_full = TableSerializer(table)
        serializer = TableBookingSerializer(table, data=request.data, partial=True)
        if serializer.is_valid():
            requested_seats = serializer.validated_data.get('seats_in_use')
            max_seats = serializer_full.data.get('seats_max')
            if (requested_seats > max_seats):
                return Response("Table cannot fit this many seats!",status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def reserve_table(request):
    if request.method == 'PUT':
        table = request.data.get('table')

        if not table:
            return JsonResponse({'message': 'Invalid input format'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            tableObj = Table.objects.get(pk=table)
            tableObj.table_in_use = True
            tableObj.save()

            return JsonResponse({'message': 'Table succesfully reserved',
                                 'table': table}, status=status.HTTP_200_OK)

        except:
            return JsonResponse({'message': 'Table number not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def leave_table(request):
    if request.method == 'PUT':
        table = request.data.get('table')

        if not table:
            return JsonResponse({'message': 'Invalid input format'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            tableObj = Table.objects.get(pk=table)
            tableObj.table_in_use = False
            tableObj.save()

            # removed any attached assistance request
            assistanceRequest = Assistance.objects.filter(table=table)
            if assistanceRequest.exists():
                assistanceRequest.delete()

            return JsonResponse({'message': 'Table succesfully left',
                                 'table': table}, status=status.HTTP_200_OK)

        except:
            return JsonResponse({'message': 'Table number not found'}, status=status.HTTP_404_NOT_FOUND)

