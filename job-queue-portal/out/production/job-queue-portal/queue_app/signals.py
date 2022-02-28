from django.db.models.signals import post_save
from django.dispatch import receiver

from queue_app.utils.model_utils import _model
from queue_app.utils.queue import enqueue


@receiver(post_save, dispatch_uid="execute_task")
def enqueue_task(sender, instance, **kwargs):
    enqueue(instance)