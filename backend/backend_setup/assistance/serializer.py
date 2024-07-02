# Import necessary modules
from rest_framework import serializers
from .models import Assistance

# Define serializer class
class AssistanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assistance
        fields = ['id', 'createdTime', 'table', 'staffAcceptedTime', 'staffName', 'tableStatus']
