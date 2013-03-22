# coding: utf-8

import json
import os
import sqlite3
import sys

DIR_PATH = os.path.dirname(os.path.realpath(__file__))
sys.path.append(DIR_PATH)

def application(environ, start_response):
    path = environ.get("PATH_INFO", "")
    token = path.split("/")
    if len(token) < 3:
        return error(start_response, "param")
    try:
        start = int(token[1])
        end = int(token[2])
    except:
        return error(start_response, "parsing")
    return history(start_response, start, end)

def history(start_response, start, end):
    con = sqlite3.connect(os.path.join(DIR_PATH, "mofun.db"))
    cur = con.cursor()
    cur.execute("""
        SELECT
            strftime('%s', jikan, 'localtime'),
            mofun_num
        FROM history
        WHERE
            jikan >= DATETIME(%d, 'unixepoch', 'localtime')
            AND
            jikan < DATETIME(%d, 'unixepoch', 'localtime')
            AND
            mofun_num IS NOT NULL
    """ % ("%s", start, end)
    )
    result = [
        {
            "jikan" : int(history[0]),
            "num" : int(history[1])
        }
        for history in cur.fetchall()
    ]
    cur.close()
    con.close()
    start_response("200 OK", [
        ("Content-type", "application/json; charset=utf-8")
    ])
    return [json.dumps({
        "history" : result
    })]

def error(start_response, message):
    start_response("400 Bad Request", [
        ("Content-type", "text/plain; charset=utf-8")
    ])
    return [message]

if __name__ == "__main__":
    print "use apache"
