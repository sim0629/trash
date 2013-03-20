# coding: utf-8

import BeautifulSoup
import datetime
import re
import sqlite3
import sys
import time
import urllib2

class Database:
    def __init__(self, db_path):
        self._con = sqlite3.connect(db_path)
        self._cur = self._con.cursor()

    def __del__(self):
        self._cur.close()
        self._con.close()

class Crawler:
    def __init__(self, ssid):
        self._url_format = "http://p.eagate.573.jp/game/jubeat/saucer/s/playdata/history.html?rival_id=%s"
        self._opener = urllib2.build_opener()
        self._opener.addheaders.append(('Cookie', 'M573SSID=%s' % ssid))
        self._center_class = re.compile(r'\bcenter\b')
        self._db = Database("mofun.db")

    def __del__(self):
        del self._db

    def _parse(self, rival_id, data):
        soup = BeautifulSoup.BeautifulSoup(data)
        div = soup.find("div", { "id" : "history" })
        if div and div.find("div", { "class" : self._center_class }):
            print "not open : %s" % rival_id
            return
        #TODO parse and insert

    def _crawl(self, rival_id):
        url = self._url_format % rival_id
        while True:
            try:
                data = self._opener.open(url)
                self._parse(rival_id, data)
                break
            except KeyboardInterrupt as ex:
                raise ex
            except:
                sys.stderr.write(str(sys.exc_info()[0]))
                sys.stderr.write("\n")

    def run_forever(self):
        while True:
            try:
                #region 573 maintain
                d = datetime.datetime.now()
                if d.hour == 4 and d.minute > 50:
                    time.sleep((2 * 60 + 20) * 60)
                #endregion 573 maintain
                #TODO select rivalids
                for rival_id in []: #TODO
                    pass #TODO spawn(crawl)
                #TODO join
            except KeyboardInterrupt as ex:
                break

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "ssid missing."
        sys.exit(1)
    crawler = Crawler(sys.argv[1])
    crawler.run_forever()
