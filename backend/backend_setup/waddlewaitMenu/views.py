from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.conf import settings
from django.contrib.staticfiles.storage import staticfiles_storage
from django.core.files.images import ImageFile

from .models import MenuItem, Category
from .serializers import CategorySerializer, MenuItemSerializer, MenuItemUpdateSerializer, MenuItemCondensedSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

@api_view(['GET'])
def menu(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        menuItems  = MenuItem.objects.all()

        # Serialize the queryset
        categories_serializer = CategorySerializer(categories, many = True)
        menuItems_serializer = MenuItemSerializer(menuItems, many = True, context={'request': request})

        data = {
            'categories': categories_serializer.data, 
            'menuItems': menuItems_serializer.data,
        }
        return JsonResponse(data)

@api_view(['GET','POST'])
def menuItemsByCategory(request, categoryName):
    if request.method == 'GET':
        try:
            category = Category.objects.get(name=categoryName)

            menuItems = MenuItem.objects.filter(category=category)
            menuItems_serializer = MenuItemSerializer(menuItems, many = True, context={'request': request})

            data = {
                'category': categoryName, 
                'menuItems': menuItems_serializer.data,
            }

            return JsonResponse(data)
        except:
            return JsonResponse({'message': 'Menu category does not exist'}, status=404)

    
    if request.method == 'POST':
        inputData = {
            'name' : categoryName,
        }
        category_serializer = CategorySerializer(data = inputData)
        if category_serializer.is_valid():
            category_serializer.save()
            return Response(category_serializer.data, status.HTTP_201_CREATED)
        return Response(category_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

@api_view(['GET'])
def menuItem(request, categoryName, pk):
    if request.method == 'GET':
        menu_item = get_object_or_404(MenuItem, pk=pk)
        menu_item_serializer = MenuItemSerializer(menu_item, context={'request': request})
        return JsonResponse(menu_item_serializer.data)

@api_view(['POST'])
def addMenuItem(request, categoryName):
    if request.method == 'POST':
        
        data = {
            'name': request.query_params.get('name'),
            'description': request.query_params.get('description'),
            'price': request.query_params.get('price'),
            'ingredients': request.query_params.get('ingredients'),
            'category': {'name' : categoryName}
        }

        #category = get_object_or_404(Category, name=categoryName)
        #data['category'] = category
        menu_item_serializer = MenuItemSerializer(data=data)

        if menu_item_serializer.is_valid():
            menu_item_serializer.save()
            return Response(menu_item_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(menu_item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def addMenuItemWithImage(request):
    if request.method == 'POST':
        image_file = request.FILES.get('image')
        data = {
            'name': request.data.get('name'),
            'description': request.data.get('description'),
            'ingredients': request.data.get('ingredients'),
            'price': request.data.get('price'),
            'category': {'name' : request.data.get('category')},
            'image': ImageFile(image_file) if image_file else None,
        }
        menu_item_serializer = MenuItemSerializer(data=data)
        if menu_item_serializer.is_valid():
            menu_item_serializer.save()
            return Response(menu_item_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(menu_item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def modifyMenuItem(request, pk):
    
    try:
        menu_item = MenuItem.objects.get(pk = pk)
    except MenuItem.DoesNotExist:
        return Response(str(MenuItem.objects.values_list('pk', flat=True)),status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        data = request.data
        if 'image' in data:
            data['image'] = ImageFile(data['image'])
        serializer = MenuItemUpdateSerializer(menu_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        menu_item.delete()
        return Response(f"Deleted: {pk}", status=status.HTTP_200_OK)
    
@api_view(['GET', 'POST'])
def categories(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        categories_serializer = CategorySerializer(categories, many = True)
        return JsonResponse({'categories': categories_serializer.data})
    
    if request.method == 'POST':
        inputData = {
            'name' : request.data.get('name')
        }
        categories = Category.objects.all()
        for category in categories:
            if str(category).lower() == request.data.get('name').lower():
                return Response("Category already exists", status=status.HTTP_409_CONFLICT)
        categories_serializer = CategorySerializer(data = inputData)
        if categories_serializer.is_valid():
            categories_serializer.save()
            return Response(categories_serializer.data, status=status.HTTP_201_CREATED)
        return Response(categories_serializer, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def modifyMenuOrder(request, pk):
    if request.method == 'GET':
        menu_items = MenuItem.objects.filter(category_id=pk)
        menu_items_serializer = MenuItemCondensedSerializer(menu_items, many = True)
        return JsonResponse({'menuItems': menu_items_serializer.data})

    if request.method == 'POST':
        try:
            list = request.data.get('menuItems')
            if isinstance(list, str):
                list = list.strip('[]')
                list_of_strings = list.split(',')
                list = [int(num_str) for num_str in list_of_strings]
            for item in list:
                print(item)
        except MenuItem.DoesNotExist:
            return Response(str(MenuItem.objects.values_list('pk', flat=True)),status=status.HTTP_404_NOT_FOUND)
        if len(list) != len(set(list)):
            return Response("Duplicate or Missing values", status=status.HTTP_400_BAD_REQUEST)
    
        for i, pk in enumerate(list):
            MenuItem.objects.filter(pk=pk).update(display_order=i)
        menu_items = MenuItem.objects.all()
        menu_items_serializer = MenuItemCondensedSerializer(menu_items, many = True)
        return JsonResponse({'menuItems': menu_items_serializer.data})

@api_view(['GET', 'POST'])
def modifyCategoryOrder(request):
    if request.method == 'GET':
        category_items = Category.objects.all()
        category_items_serializer = Category(category_items, many = True)
        return JsonResponse({'categories': category_items_serializer.data})

    if request.method == 'POST':
        try:
            list = request.data.get('categories')
            print(list)
            # list = list[1:-1].split(',')
            for item in list:
                category_item = get_object_or_404(Category, pk=item)
        except Category.DoesNotExist:
            return Response(str(Category.objects.values_list('pk', flat=True)),status=status.HTTP_404_NOT_FOUND)
        if len(list) != len(set(list)):
            return Response("Duplicate or Missing values", status=status.HTTP_400_BAD_REQUEST)
    
        for i, pk in enumerate(list):
            Category.objects.filter(pk=pk).update(display_order=i)
        category_items = Category.objects.all()
        category_items_serializer = MenuItemCondensedSerializer(category_items, many = True)
        return JsonResponse({'categories': category_items_serializer.data})
