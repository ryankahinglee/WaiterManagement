from rest_framework import serializers
from .models import Category, MenuItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id",
                  "name"]


class MenuItemSerializer(serializers.ModelSerializer):

    category = CategorySerializer()

    class Meta:
        model = MenuItem
        fields = ["id",
                  "name", 
                  "description",
                  "ingredients", 
                  "price", 
                  "image",
                  "category"]

    def create(self, validated_data):
        categoryData = validated_data.pop('category')
        category, _ = Category.objects.get_or_create(**categoryData)
        menu_item = MenuItem.objects.create(category=category, **validated_data)
        return menu_item
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url)

class MenuItemUpdateSerializer(serializers.ModelSerializer): # new serializer class
    class Meta:
        model = MenuItem
        fields = ['name', 'description', 'price', 'ingredients', "image", "category"] # define required fields

class MenuItemCondensedSerializer(serializers.ModelSerializer): # new serializer class
    class Meta:
        model = MenuItem
        fields = ['id','name'] # define required fields


        