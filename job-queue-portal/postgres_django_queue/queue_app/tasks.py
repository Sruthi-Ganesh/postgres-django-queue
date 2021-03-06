import random

from celery import shared_task

from queue_app.enums import TaskStatusEnum
from queue_app.utils.model_utils import _model
from queue_app.utils.postgres_triggers import notify
from queue_app.utils.queue import dequeue, enqueue


# scheduled to run every minute
@shared_task(name="dequeue_job")
def dequeue_job():
    print("Dequeue job started")
    job_queue = dequeue()
    if job_queue:
        task = job_queue.task
        process_task(task)


@shared_task(name="process_job")
def process_job(job_id):
    job_queue_model = _model('JobQueue')
    print("process job started")
    job_queue = job_queue_model.objects.get(id=job_id)
    task = job_queue.task
    process_task(task)


def process_task(task):
    print("process")
    if task:
        task.status = TaskStatusEnum.ENQUEUED.value
        task.save()
        success = do_some_operation()
        if not success:
            task.status = TaskStatusEnum.FAILED.value
            task.save()
            # if fails enqueue again if the number of retry is less than the specified limit else discard task as failed
            if task.can_enqueue():
                enqueue(task)
        else:
            task.status = TaskStatusEnum.COMPLETED.value
            task.save()
        print("notifying.....")
        notify()


def do_some_operation():
    """
    Randomly mark the operation to fail
    :return: Returns false if failed
    """
    n = random.randint(0, 10)
    if n % 2 == 0:
        return False
    return True
