from django.apps import apps


def _model(model_name):
    """Generically retrieve a model object.

    This is a hack around Django/Celery's inherent circular import
    issues with tasks.py/models.py. In order to keep clean abstractions, we use
    this to avoid importing from models, introducing a circular import.

    No solutions for this are good so far (unnecessary signals, inline imports,
    serializing the whole object, tasks forced to be in model, this), so we
    use this because at least the annoyance is constrained to tasks.
    """
    return apps.get_model('queue_app', model_name)