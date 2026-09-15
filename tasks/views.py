from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Task
from .serializer import CreateTaskSerializer


@api_view(['POST'])
def create_task(request):
    serializer = CreateTaskSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_tasks(request):
    tasks = Task.objects.all()
    serializer = CreateTaskSerializer(tasks, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['GET'])
def get_task(request, id):
    try:
        task = Task.objects.get(id=id)
    except Task.DoesNotExist:
        return Response(
            {"message": "Task not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = CreateTaskSerializer(task)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
def update_task(request, id):
    try:
        task = Task.objects.get(id=id)
    except Task.DoesNotExist:
        return Response(
            {"message": "Task not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = CreateTaskSerializer(task, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_task(request, id):
    try:
        task = Task.objects.get(id=id)
    except Task.DoesNotExist:
        return Response(
            {"message": "Task not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    task.delete()

    return Response(
        {"message": "Task deleted successfully"},
        status=status.HTTP_204_NO_CONTENT
    )