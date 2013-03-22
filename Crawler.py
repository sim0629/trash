# coding: utf-8

import BeautifulSoup
import datetime
import re
import sqlite3
import sys
import time
import unicodedata
import urllib2

class Database:
    def __init__(self, db_path):
        self._con = sqlite3.connect(db_path)
        self._cur = self._con.cursor()
        self._create_table()

    def __del__(self):
        self._cur.close()
        self._con.close()

    def _create_table(self):
        self._cur.execute('''
            CREATE TABLE
            IF NOT EXISTS
            history
            (
                rival_id INT NOT NULL,
                jikan DATETIME NOT NULL,
                tenpo TEXT NOT NULL,
                mofun_num INT,
                PRIMARY KEY (rival_id, jikan)
            )
        ''')
        self._cur.execute('''
            CREATE INDEX
            IF NOT EXISTS
            jikan_index
            ON history
            (jikan)
        ''')
        self._con.commit()

    def commit(self):
        self._con.commit()

    def insert(self, rival_id, jikan, tenpo, mofun_num):
        try:
            self._cur.execute('''
                INSERT INTO
                history
                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?
                )
            ''', (
                rival_id,
                jikan,
                tenpo,
                mofun_num,
            ))
        except sqlite3.IntegrityError:
            pass

class Crawler:
    def __init__(self, ssid, rivalid_file):
        self._url_format = "http://p.eagate.573.jp/game/jubeat/saucer/s/playdata/history.html?rival_id=%d"
        self._opener = urllib2.build_opener()
        self._opener.addheaders.append(("Cookie", "M573SSID=%s" % ssid))
        self._center_class = re.compile(r"\bcenter\b")
        self._header_class = re.compile(r"\bheader\b")
        self._mofun_num_pattern = re.compile(r"SaDang MOFUN\s*(\d+)$")
        self._jikan = u"プレー日時:"
        self._tenpo = u"プレー店舗:"
        f = open(rivalid_file, "r")
        self._rivalids = [int(rival_id.strip()) for rival_id in f.readlines()]
        f.close()
        self._db = Database("mofun.db")

    def __del__(self):
        del self._db

    def _parse(self, rival_id, data):
        soup = BeautifulSoup.BeautifulSoup(data)
        div = soup.find("div", { "id" : "history" })
        if not div:
            print "no history div : %s" % rival_id
            return
        if div.find("div", { "class" : self._center_class }):
            print "not open : %s" % rival_id
            return
        for header in div.findAll("div", { "class" : self._header_class }):
            text = unicodedata.normalize("NFKD", header.text)
            (jikan, tenpo) = text.replace(self._jikan, "").split(self._tenpo)
            jikan = jikan.replace("/", "-")
            match = self._mofun_num_pattern.search(tenpo)
            mofun_num = None
            if match:
                mofun_num = int(match.group(1))
            self._db.insert(rival_id, jikan, tenpo, mofun_num)

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
                print d
                for rival_id in self._rivalids:
                    self._crawl(rival_id)
                self._db.commit()
            except KeyboardInterrupt as ex:
                break

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "ssid missing."
        sys.exit(1)
    elif len(sys.argv) < 3:
        print "rivalid file missing."
        sys.exit(1)
    crawler = Crawler(sys.argv[1], sys.argv[2])
    crawler.run_forever()
