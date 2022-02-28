# postgres-django-queue
Queue for postgres developed using Django. 

# Development
## Django
- Two models - Task and JobQueue
  - Task: The task that needs to be executed
  - JobQueue: The queue that holds the task
- Handles postgres queue update
- Serves http and websocket
### http
- /task/ -> To add (POST) or retrieve all tasks (GET)
- /task/?<query_params/ - To filter task based on status, name etc
- /task/<id> - To delete (DELETE), update (PATCH) tasks for status update
### websocket
- /ws/task/ - Client to listen on the websocket channel for any postgres update

## Celery
- Using asynchronous tasks to dequeue the already enqueued tasks. The dequeued job queue row will be used to execute the task. The task may succeed or fail randomly based on the do_some_operation method
- Also has the capability to execute tasks which are manually scheduled by the user at a specified time
  
## Postgres
  - Configured postgres with django for task and queue update
  - Using LISTEN and NOTIFY to help client to be notified about changes in task model
  - To speed up database oprations and blocks reads from uncommitted transactions, set default_transaction_isolation TO 'read committed';
  
## React
  - Contains a table of all tasks displayed
  - Can filter the table based on task name and status
  - Can mark task as completed or failed
  - Can add new tasks
  - Can view a overview pie chart listing the count of task based on its status
  - Clone the repo and perform
    - `npm run build`
    - `npm install -g server`
    - `serve -s build`
  - Loading the page in http://localhost:3000 should directly hit the host and containers. 
  
# Production - Docker
### deployed in host: (***.***.***.198)
## containers
  - Postgres
  - Nginx
  - Django app (uwsgi)
  - Django websocket app (daphne)
  - Celery beat
  - Celery Worker
  - Redis
  - Django postgres listen (To listen to postgres notify)
