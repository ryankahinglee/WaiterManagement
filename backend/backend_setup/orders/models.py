from django.db import models

from waddlewait_app.models import Table
from waddlewaitMenu.models import MenuItem

# Create your models here.

class Order(models.Model):
    # Reference to the table model
    created_at = models.DateTimeField(auto_now_add=True)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    
    is_complete = models.BooleanField(default=False)
    
    # ready_to_serve = models.BooleanField(default=False)
    # wait_staff_assigned = models.CharField(max_length=255, default="")
    # deliver = models.BooleanField(default=False)
    
    bill = models.DecimalField(max_digits=10, decimal_places=2)

class OrderItem(models.Model):
    # Reference to the order model
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    # Reference to the MenuItem model
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    is_preparing = models.BooleanField(default=False)
    is_ready = models.BooleanField(default=False)
    
    item_made_time = models.DateTimeField(null=True)
    wait_staff_assigned_time = models.DateTimeField(null=True)
    wait_staff_assigned = models.CharField(max_length=255, default="none")
    deliver = models.BooleanField(default=False)

class BillRequest(models.Model):
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    staff_name = models.CharField(max_length=255, default="tempStaffName")
    request_status = models.BooleanField(default=False)
    table_id = models.IntegerField(default=1)