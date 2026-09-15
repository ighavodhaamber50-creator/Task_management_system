from rest_framework import serializers
from .models import Task


class CreateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'due_date',
            'priority',
            'is_completed',
        ]