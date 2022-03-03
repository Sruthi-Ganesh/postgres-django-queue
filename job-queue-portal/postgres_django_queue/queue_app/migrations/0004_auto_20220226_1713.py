# Generated by Django 3.2.12 on 2022-02-26 17:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('queue_app', '0003_auto_20220226_1516'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='jobqueue',
            name='completed_at',
        ),
        migrations.AlterField(
            model_name='jobqueue',
            name='task',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='job_queue', to='queue_app.task'),
        ),
    ]
