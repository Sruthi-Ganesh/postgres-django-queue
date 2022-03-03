import enum


class TaskStatusEnum(enum.Enum):
    IN_PROGRESS = 1
    ENQUEUED = 2
    FAILED = 3
    COMPLETED = 4
    ENQUEUED_AFTER_FAILURE = 5
