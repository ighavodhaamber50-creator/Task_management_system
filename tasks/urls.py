from django.urls import path
from .views import create_task, get_tasks, get_task, update_task, delete_task

urlpatterns = [
    path('create/', create_task),
    path('', get_tasks),
    path('<int:id>/', get_task),
    path('<int:id>/update/', update_task),
    path('<int:id>/delete/', delete_task),
]