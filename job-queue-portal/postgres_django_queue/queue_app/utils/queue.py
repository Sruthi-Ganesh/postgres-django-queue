from queue_app.enums import TaskStatusEnum
from queue_app.utils.model_utils import _model


def dequeue():
    job_queue_model = _model('JobQueue')
    task_model = _model('Task')
    tasks = list(job_queue_model.objects.raw(
        """
        DELETE FROM {queue_table}
        WHERE id = (
            SELECT q.id
            FROM {queue_table} q
            LEFT JOIN {task_table} t 
            ON t.id = q.task_id
            WHERE t.execute_at <= now()
            ORDER BY t.priority DESC, q.created_at
            FOR UPDATE SKIP LOCKED
            LIMIT 1
        )
        RETURNING *;
        """.format(
            queue_table=job_queue_model.get_table_name(),
            task_table=task_model.get_table_name(),
        )
    ))
    if tasks:
        return tasks[0]
    else:
        return None


def enqueue(task):
    job_queue_model = _model('JobQueue')
    from queue_app.tasks import process_job
    job_id = job_queue_model.objects.create(task=task)
    task.status = TaskStatusEnum.ENQUEUED.value
    task.save()
    if task.manually_scheduled:
        process_job.apply_async(eta=task.execute_at, args=(job_id))
