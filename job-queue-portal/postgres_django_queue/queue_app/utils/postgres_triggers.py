import select

import psycopg2.extensions
from django.db import connection

from queue_app.utils.websocket_utils import send_channel_message


def listen():
    crs = connection.cursor()  # get the cursor and establish the connection.connection
    pg_con = connection.connection
    pg_con.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
    crs.execute('LISTEN queue_update;')

    print("Waiting for notifications on channel 'queue_update'")
    while 1:
        if select.select([pg_con], [], [], 5) == ([], [], []):
            print("Timeout")
        else:
            pg_con.poll()
            while pg_con.notifies:
                notify_obj = pg_con.notifies.pop()
                print("Got NOTIFY:", notify_obj)
                send_channel_message('Call api for task update details')


##########################################################
# django postgres polling - NOTIFY


def notify():
    print("notifying")
    crs = connection.cursor()  # get the cursor and establish the connection.connection
    connection.connection.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
    crs.execute('NOTIFY queue_update;')

    crs.execute('SELECT pg_sleep(6); NOTIFY queue_update;')
