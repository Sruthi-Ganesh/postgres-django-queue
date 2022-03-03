export const SERVER_URL = 'http://142.132.173.198/api/';

export const WEBSOCKET_URL = 'ws://142.132.173.198/ws/task/'

export const TASK_TABLE_VALUES = [
    {
      id: 'select',
      numeric: false,
      disablePadding: true,
      label: 'Select Task (1)',
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Task Name',
    },
    {
      id: 'priority',
      numeric: false,
      disablePadding: false,
      label: 'Priority',
    },
    {
      id: 'created_at',
      numeric: false,
      disablePadding: false,
      label: 'Created At',
    },
    {
      id: 'updated_at',
      numeric: false,
      disablePadding: false,
      label: 'Updated At',
    },
    {
      id: 'number_of_failures',
      numeric: false,
      disablePadding: false,
      label: 'Total Retries',
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: false,
      label: 'Status',
    },
  ];

  export const TASK_TABLE_COLORS = [
    {
      'color': '#8FB300',
      'key': 'in-progress',
      'title': 'In Progress',
      'value': 1,
    }, {
      'color': '#1C8D00',
      'key': 'enqueued',
      'title': 'Enqueued',
      'value': 2,
    }, {
      'color': '#FF0000',
      'key': 'failed',
      'title': 'Failed',
      'value': 3,
    }, {
      'color': '#008000',
      'key': 'completed',
      'title': 'Completed',
      'value': 4,
    },
    {
      'color': '#FF0000',
      'key': 'enqueued_again',
      'title': 'Enqueued After Failure',
      'value': 5,
    }
  ]

  export const TASK_STATUS = {
    IN_PROGRESS: 1,
    ENQUEUED: 2,
    FAILED: 3,
    COMPLETED: 4,
    ENQUEUED_AGAIN: 5,
  }

  export const TASK_STATUS_KEY = {
    1: 'In Progress',
    2: 'Enqueued',
    3: 'Failed',
    4: 'Completed',
    5: 'Enqueued After Failure'
  }

  export const TASK_PRIORITY_KEY = {
    0: 'Low Priority',
    1: 'Medium Priority',
    2: 'High Priority',
  }
