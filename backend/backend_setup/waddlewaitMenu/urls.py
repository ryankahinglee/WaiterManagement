from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
#if settings.DEBUG:
#        urlpatterns += static(settings.MEDIA_URL,
#                              document_root=settings.MEDIA_ROOT)

urlpatterns = [
    path('', views.menu, name='menu'),
    path('modify/<int:pk>', views.modifyMenuItem, name='modify-menu-item'),
    path('categories', views.categories, name ="category"),
    path('order/categorised/<int:pk>/', views.modifyMenuOrder, name='modify-menu-item'), #pk is category id
    path('order/categories', views.modifyCategoryOrder, name ="category"),
    path('addnew/', views.addMenuItemWithImage, name ="addMenuItemWithImage"),

    path('<str:categoryName>/',views.menuItemsByCategory, name='category-items'),
    path('<str:categoryName>/<int:pk>/', views.menuItem, name='menu-item'),
    path('<str:categoryName>/add/', views.addMenuItem, name='add-menu-item'),
]