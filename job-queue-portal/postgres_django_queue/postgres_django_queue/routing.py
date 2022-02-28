from django.urls import re_path

from queue_app import websocket

websocket_urlpatterns = [
    re_path(r'ws/task/$', websocket.EventConsumer.as_asgi()),
]
