from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import OrderItem, Order
import json

class OrderDeliverRequestNotificationViewTestCase(APITestCase):
    def setUp(self):
        # Create an order
        self.order = Order.objects.create(
            table=1,
            items=[1, 2, 3],
            ready_to_serve=False,
            is_complete=False,
            wait_staff_assigned="none",
            deliver=False,
            bill=50.00
        )
        
    def test_put_valid_data(self):
        # generate request based on views name
        sendNotificationViewURL = reverse('orders-delivernotifications')
        data = {"table": 1,
                "items": [1, 2, 3],
                "ready_to_serve": False,
                "is_complete": False,
                "wait_staff_assigned": "none",
                "deliver": False,
                "bill": "50.00"}
        json_data = json.dumps(data)  # Serialize data to JSON string
        response = self.client.put(sendNotificationViewURL, json_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_invalid_data(self):
        sendNotificationViewURL = reverse('orders-delivernotifications')
        data = {}  # Invalid data without required fields
        json_data = json.dumps(data)  # Serialize data to JSON string
        response = self.client.put(sendNotificationViewURL, json_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class OrderDeliverNotificationAcceptedViewTestCase(APITestCase):
    def test_put_valid_data(self):
        # Create test data
        sendNotificationViewURL = reverse('orders-delivernotifications')
        data = {"order": 1, "item": 1, "quantity": 2, "is_preparing": False, "is_ready": True, "wait_staff_assigned": "none", "deliver": False}
        response = self.client.post(sendNotificationViewURL, data)
        acceptedViewURL = reverse('orders-delivernotifications-accepted')
        response = self.client.put(acceptedViewURL, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Add more test cases as needed for different scenarios

class OrderDeliverNotificationCompleteViewTestCase(APITestCase):
    def test_put_valid_data(self):
        # Create test data
        url = reverse('orders-delivernotifications-completed')
        data = {"order": 1, "item": 1, "quantity": 2, "is_preparing": True, "is_ready": True, "wait_staff_assigned": "Bob", "deliver": True}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Add more test cases as needed for different scenarios

class OrdersDeliverGetAllNotificationsViewTestCase(APITestCase):
    def test_get_all_notifications(self):
        # Create test data
        url = reverse('order-deliverrequests')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    # Add more test cases as needed for different scenarios

class OrdersCheckoutBillViewTestCase(APITestCase):
    def test_get_bill(self):
        # Create test data
        url = reverse('orders-checkout', kwargs={'tableNumber': 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['bill'], 99)

    def test_get_bill_invalid_table_number(self):
        url = reverse('orders-checkout', kwargs={'tableNumber': 99})  # Invalid table number
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)