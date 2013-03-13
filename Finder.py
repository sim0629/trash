# coding: utf-8

import BeautifulSoup
import datetime
import Queue
import re
import sys
import time
import urllib2

class Finder:
    def __init__(self, ssid, rival_ids):
        if not rival_ids:
            rival_ids = ["57710029431862"]
        self._url_format = "http://p.eagate.573.jp/game/jubeat/saucer/s/playdata/history.html?rival_id=%s&page=%d"
        self._opener = urllib2.build_opener()
        self._opener.addheaders.append(('Cookie', 'M573SSID=%s' % ssid))
        self._center_class = re.compile(r'\bcenter\b')
        self._q = Queue.Queue()
        self._len = 0
        self._d = {}
        for rival_id in rival_ids:
            self._enqueue(rival_id)

    def _enqueue(self, rival_id):
        if rival_id in self._d:
            return
        self._q.put(rival_id)
        self._len += 1
        self._d[rival_id] = True
        print rival_id

    def _parse(self, data):
        soup = BeautifulSoup.BeautifulSoup(data)
        has = False
        for td in soup.findAll("td", { "class" : "member_name" }):
            has = True
            a = td.find("a")
            if not a:
                continue
            href = a["href"]
            rival_id = href.split("=")[1]
            self._enqueue(rival_id)
        if not has:
            div = soup.find("div", { "id" : "history" })
            if div and div.find("div", { "class" : self._center_class }):
                return False # not open
        return True

    def _crawl(self, rival_id):
        for page_num in [1, 2, 3]:
            url = self._url_format % (rival_id, page_num)
            while True:
                try:
                    data = self._opener.open(url)
                    break
                except:
                    sys.stderr.write(str(sys.exc_info()[0]))
                    sys.stderr.write("\n")
            if not self._parse(data):
                break

    def run(self):
        while not self._q.empty():
            rival_id = self._q.get()
            d = datetime.datetime.now()
            if d.hour == 4 and d.minute > 50: # 573 maintain
                time.sleep((2 * 60 + 20) * 60)
            self._crawl(rival_id)
            sys.stdout.flush()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "ssid missing."
        sys.exit(1)
    finder = Finder(sys.argv[1], sys.argv[2:])
    finder.run()
    sys.exit(0)
