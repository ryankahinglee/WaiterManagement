from django.urls import path
from .views import RequestNotificationView, NotificationAcceptedView, NotificationCompleteView, GetAllNotificationsView, RequestNotificationCheckView, NotificationAcceptedCheckView

urlpatterns = [
    path('notifications', RequestNotificationView.as_view()),
    path('notificationscheck', RequestNotificationCheckView.as_view()),
    path('notifications/accepted', NotificationAcceptedView.as_view()),
    path('notifications/acceptedcheck', NotificationAcceptedCheckView.as_view()),
    path('notifications/completed', NotificationCompleteView.as_view()),
    path('requests', GetAllNotificationsView.as_view()),
]
