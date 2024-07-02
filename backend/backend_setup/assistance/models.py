from django.db import models

class Assistance(models.Model):
    createdTime = models.DateTimeField(auto_now_add=True)
    table = models.IntegerField() 
    staffAcceptedTime = models.DateTimeField(null=True)
    staffName = models.CharField(max_length=255, default="none")
    tableStatus = models.BooleanField(default=False)
    
    def __str__(self):
        return self.tableStatus