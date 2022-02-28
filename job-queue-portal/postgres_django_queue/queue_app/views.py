from rest_framework import generics

from queue_app.models import Task
from queue_app.serializers import TaskSerializer


class TaskCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TaskCreateListView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        status = self.request.query_params.get('status', None)
        if status:
            return Task.objects.filter(status=int(status))
        return Task.objects.all()


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
