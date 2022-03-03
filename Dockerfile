FROM nginx:1.19.0-alpine

COPY ./queue-monitoring-fe/build /var/www
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/prod/nginx.conf /etc/nginx/conf.d
COPY ./nginx/prod/uwsgi_params /etc/nginx/
