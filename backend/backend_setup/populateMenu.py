import os
import django

from django.core.files import File
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'waddlewait.settings')
django.setup()

from waddlewaitMenu.models import Category,MenuItem

def populateMenu():

    categories = ['Appetizers', 'Mains', 'Desserts', 'Drinks']

    for category_name in categories:
        Category.objects.get_or_create(name=category_name)

    menuItems = [
        # APPETIZERS
        {'name': 'Tomato Soup', 'description': 'delicious tomato soup', 'price': 5.49,
         'image_path': 'app1_tomatosoup.jpg', 'category_name': 'Appetizers'},
        {'name': 'Chicken Salad', 'description': 'healthy serving of chicken and salad greens', 'price': 4.49,
         'image_path': 'app2_chickensalad.jpg', 'category_name': 'Appetizers'},
        {'name': 'Crispy Corn', 'description': 'roasted corn on a skillet', 'price': 4.99,
         'image_path': 'app3_crispycorn.jpg', 'category_name': 'Appetizers'},

        # MAINS
        {'name': 'Grilled Fish', 'description': 'barramundi fish grilled over nice heat', 'price': 12.99,
         'image_path': 'mains1_grilledfish.jpg', 'category_name': 'Mains'},
        {'name': 'Chicken and Rice', 'description': 'some rice and some chick', 'price': 13.49,
         'image_path': 'mains2_chickenandrice.jpg', 'category_name': 'Mains'},
        {'name': 'Turkey and Ham Pie', 'description': 'leftover turkey and ham type of vibe', 'price': 11.99,
         'image_path': 'mains3_turkeyandhampie.jpg', 'category_name': 'Mains'},  
        {'name': 'Vegetable Pasta', 'description': 'for the vegans', 'price': 15.49,
         'image_path': 'mains4_vegetablepasta.jpg', 'category_name': 'Mains'},

        # DESSERTS
        {'name': 'Fruit Cream', 'description': 'fruit mixed sweet evaporated milk', 'price': 8.49,
         'image_path': 'dessert1_fruitcream.jpg', 'category_name': 'Desserts'},
        {'name': 'Ice Cream', 'description': 'napeleon flavours of hardened milk', 'price': 6.99,
         'image_path': 'dessert2_icecream.jpg', 'category_name': 'Desserts'},
        {'name': 'Oreo Cheesecake', 'description': 'the best combo made by man', 'price': 9.99,
         'image_path': 'dessert3_oreocheesecake.jpg', 'category_name': 'Desserts'},
        {'name': 'Apple Pie', 'description': 'apple and flaky crust', 'price': 7.49,
         'image_path': 'dessert4_applepie.jpg', 'category_name': 'Desserts'},

        # DRINKS
        {'name': 'Mineral Water', 'description': 'a semi fancier water than tap', 'price': 4.49,
         'image_path': 'drinks1_mineralwater.jpg', 'category_name': 'Drinks'},
        {'name': 'Fruit Juice', 'description': 'sweetened water by sugar fruit', 'price': 6.99,
         'image_path': 'drinks2_fruitjuice.jpg', 'category_name': 'Drinks'},
        {'name': 'Coffee', 'description': 'roasted perfection for the sleep deprived', 'price': 7.49,
         'image_path': 'drinks3_coffee.jpg', 'category_name': 'Drinks'},
        {'name': 'Tea', 'description': 'leaf juice', 'price': 6.49,
         'image_path': 'drinks4_tea.jpg', 'category_name': 'Drinks'},
        {'name': 'Wine', 'description': 'for those looking for a fun time', 'price': 3.49,
         'image_path': 'drinks5_wine.jpg', 'category_name': 'Drinks'},
    ]


    for item_data in menuItems:
        category = Category.objects.get(name=item_data['category_name'])

        image_filename = item_data['image_path']
        image_path = os.path.join(settings.BASE_DIR, 'media/menu_images', image_filename)

        menu_item = MenuItem.objects.create(
            name=item_data['name'],
            description=item_data['description'],
            price=item_data['price'],
            category=category
        )

        # Open and assign the image file to the menu item
        with open(image_path, 'rb') as f:
            menu_item.image.save(image_filename, File(f))

        # Construct the full URL for the image
        image_url = f"{settings.MEDIA_URL}{image_filename}"

        # Update the menu item's image URL
        menu_item.image = image_url
        menu_item.save()

        print(f"Added menu item: {menu_item}")

if __name__ == '__main__':
    populateMenu()

    