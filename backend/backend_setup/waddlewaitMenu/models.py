from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    display_order = models.IntegerField(default = 99999) #thus new items are shown last
    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return self.name

class MenuItem(models.Model):

    name = models.CharField(max_length=100, unique = True, blank = False)
    description = models.TextField()
    ingredients = models.TextField(default="sugar, spice, and everything nice")
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='menu_images/', default='menu_images/default_image.jpg')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='menu_items')
    display_order = models.IntegerField(default = 99999) #thus new items are shown last
    
    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return self.name