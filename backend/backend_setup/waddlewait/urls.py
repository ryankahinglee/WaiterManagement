"""
URL configuration for waddlewait project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin

from django.urls import path, include
from waddlewait_app import views
from django.conf import settings
from django.conf.urls.static import static

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('authentication/', include('users.urls')),
    path('assistance/', include('assistance.urls')),
    path('orders/', include('orders.urls')),
    path('tables/', views.table_list),
    path('table/<int:table_number>', views.table_detail),
    path('table/reserve', views.reserve_table),
    path('table/leave', views.leave_table),
    path('menu/', include('waddlewaitMenu.urls')),
    path('customer/', include('customer.urls')),
    path('kitchenstaff/', include('kitchenstaff.urls')),
    path('manager/', include('manager.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
