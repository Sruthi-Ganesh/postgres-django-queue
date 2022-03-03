FROM python:3.8.3-alpine

ENV MICRO_SERVICE=/home/app/microservice/postgres_django_queue
# set work directory


RUN mkdir -p $MICRO_SERVICE
RUN mkdir -p $MICRO_SERVICE/static

# where the code lives
WORKDIR $MICRO_SERVICE

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev libffi-dev

# install dependencies
RUN pip install --upgrade pip
# copy project
COPY . $MICRO_SERVICE
RUN pip install -r requirements.txt
COPY ./entrypoint.sh $MICRO_SERVICE

CMD ["/bin/bash", "/home/app/microservice/postgres_django_queue/entrypoint.sh"]