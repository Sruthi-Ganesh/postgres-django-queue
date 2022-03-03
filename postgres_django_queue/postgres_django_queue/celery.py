from __future__ import absolute_import

import os

from celery import Celery
from celery.schedules import crontab

# set the default Django settings module for the 'celery' program.
# this is also used in manage.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'postgres_django_queue.settings')

BASE_REDIS_URL = os.environ.get('REDIS_URL', 'redis://redis:6379')

app = Celery('postgres_django_queue')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.broker_url = BASE_REDIS_URL


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


app.conf.beat_schedule = {
    # Execute the Speed Test every 10 minutes
    'dequeue_job_every_1_minute': {
        'task': 'dequeue_job',
        'schedule': crontab(minute='*/1'),
    },
}
