from django.db import models

# Create your models here.

class Table(models.Model):
    table_number = models.IntegerField(primary_key = True, blank=True)
    table_in_use = models.BooleanField(blank=True)
    seats_max = models.IntegerField(blank=True)
    seats_in_use = models.IntegerField(blank=True)
    def __str__(self):
        return "table " + str(self.table_number)
