import datetime
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Assistance

# Import the serializer
from .serializer import AssistanceSerializer

class RequestNotificationView(APIView):
    def post(self, request):
        serializer = AssistanceSerializer(data=request.data)
        
        # Validate the serializer
        if serializer.is_valid():
            # Save the validated data
            serializer.save()
            # Return success response
            return Response("Notification request received", status=status.HTTP_200_OK)
        else:
            # Return error response if validation fails
            return Response("Notification request fail", status=status.HTTP_400_BAD_REQUEST)
        
class RequestNotificationCheckView(APIView):
    def get(self, request):
        try:
            object = Assistance.objects.exclude(createdTime__isnull=True).latest('createdTime')
            
            # Retrieve the values of 'createdTime' and 'table' fields
            created_time = object.createdTime
            table_data = object.table
            
            return Response({
                    'most_recent_assistance_request': created_time,
                    'table_data': table_data
                        })
        except Assistance.DoesNotExist:
            return Response("No Assistance request found", status=status.HTTP_404_NOT_FOUND)
    
class NotificationAcceptedView(APIView):
    def put(self, request):
        tableCheck = request.data.get('table')
        staffName = request.data.get('staffName')
        tableStatusCheck = request.data.get('tableStatus')
        assistanceRequest = Assistance.objects.filter(table=tableCheck, tableStatus=tableStatusCheck)
        
        if assistanceRequest.exists():
            for request in assistanceRequest:
                request.staffName = staffName
                request.staffAcceptedTime = timezone.now()
                request.save()
            
            return Response("Staff accepted request success", status=status.HTTP_200_OK)
        else:
            return Response("Staff accepted request fail", status=status.HTTP_404_NOT_FOUND)
        
class NotificationAcceptedCheckView(APIView):
    def get(self, request):
        try:
            object = Assistance.objects.exclude(staffAcceptedTime__isnull=True).latest('staffAcceptedTime')
            
            staff_accepted_time = object.staffAcceptedTime
            staff_accepted = object.staffName
            table_data = object.table
            
            return Response({'staff_accepted_time': staff_accepted_time,'staff_accepted':staff_accepted, 'table_data': table_data})
        except Assistance.DoesNotExist:
            return Response("No Assistance request found", status=status.HTTP_404_NOT_FOUND)
        

class NotificationCompleteView(APIView):
    def put(self, request):
        tableCheck = request.data.get('table')
        tableStatusCheck = request.data.get('tableStatus')
        assistanceRequest = Assistance.objects.filter(table=tableCheck, tableStatus=tableStatusCheck)
        if assistanceRequest.exists():
            assistanceRequest.delete()
            
            return Response("Notifications deleted", status=status.HTTP_200_OK)
        else:
            # If no notifications are found, return a response indicating that
            return Response("No notifications found for the provided table number and status", status=status.HTTP_404_NOT_FOUND)

class GetAllNotificationsView(APIView):
    def get(self, request):
        try:
            # Retrieve all assistance requests with tableStatus=False from the database
            assistance = Assistance.objects.filter(tableStatus=False)
            
            # Serialize the assistance data
            assistanceSerializer = AssistanceSerializer(assistance, many=True)
            
            # Return the serialized data as a response
            return Response(assistanceSerializer.data, status=status.HTTP_200_OK)
        except Assistance.DoesNotExist:
            return Response("No Assistance request found", status=status.HTTP_404_NOT_FOUND)