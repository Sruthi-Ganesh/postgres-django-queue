from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from queue_app.utils.postgres_triggers import listen


class Command(BaseCommand):

    def handle(self, *args, **options):
        listen()
