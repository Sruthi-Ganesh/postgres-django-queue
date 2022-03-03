from django.utils import timezone
from django.db import models
from django.db.models.signals import post_save

from queue_app.enums import TaskStatusEnum
from django.dispatch import receiver

from queue_app.utils.queue import enqueue


class Task(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    status = models.IntegerField(default=TaskStatusEnum.IN_PROGRESS.value, db_index=True)
    priority = models.IntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(editable=False)
    execute_at = models.DateTimeField(null=True)
    manually_scheduled = models.BooleanField(default=False)
    number_of_retries = models.IntegerField(default=0)

    def __str__(self):
        return '%s: %s' % (self.id, self.name)

    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = timezone.now()
            if not self.execute_at:
                self.execute_at = timezone.now()
            else:
                self.manually_scheduled = True
        self.updated_at = timezone.now()
        if self.status == TaskStatusEnum.FAILED.value:
            self.number_of_retries = self.set_handle_number_retries()
        return super(Task, self).save(*args, **kwargs)

    def set_handle_number_retries(self) -> int:
        if self.can_enqueue():
            return self.number_of_retries + 1
        else:
            return self.number_of_retries

    def can_enqueue(self) -> bool:
        return self.number_of_retries <= 3

    @classmethod
    def get_table_name(cls):
        return cls._meta.db_table


class JobQueue(models.Model):
    id = models.BigAutoField(primary_key=True)
    task = models.OneToOneField(Task, on_delete=models.CASCADE, related_name='job_queue')
    created_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        return super(JobQueue, self).save(*args, **kwargs)

    def __str__(self):
        return '%s' % self.id

    @classmethod
    def get_table_name(cls):
        return cls._meta.db_table


@receiver(post_save, sender=Task, dispatch_uid="execute_task")
def enqueue_task(sender, instance, **kwargs):
    if instance.status == TaskStatusEnum.IN_PROGRESS.value:
        enqueue(instance)

