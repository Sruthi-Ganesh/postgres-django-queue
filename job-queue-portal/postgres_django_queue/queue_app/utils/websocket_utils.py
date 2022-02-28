from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def send_channel_message(message):
    layer = get_channel_layer()
    async_to_sync(layer.group_send)('events', {
        'type': 'events.alarm',
        'content': 'triggered'
    })
    print("Done")