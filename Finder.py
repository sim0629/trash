# coding: utf-8

import BeautifulSoup
import Queue
import sys
import urllib

class Finder:
    def __init__(self, rival_ids):
        if not rival_ids:
            rival_ids = ["57710029431862"]
        self._url_format = "http://p.eagate.573.jp/game/jubeat/saucer/s/playdata/history.html?rival_id=%s&page=%d"
        self._q = Queue.Queue()
        self._d = {}
        for rival_id in rival_ids:
            self._enqueue(rival_id)

    def _enqueue(self, rival_id):
        if rival_id in self._d:
            return
        self._q.put(rival_id)
        self._d[rival_id] = True

    def _parse(self, data):
        soup = BeautifulSoup.BeautifulSoup(data)
        print soup.prettify()

    def _crawl(self, rival_id):
        for page_num in [1, 2, 3]:
            url = self._url_format % (rival_id, page_num)
            data = urllib.urlopen(url)
            self._parse(data)

    def run(self):
        while not self._q.empty():
            rival_id = self._q.get()
            self._crawl(rival_id)

if __name__ == "__main__":
    finder = Finder(sys.argv[1:])
    finder.run()
    sys.exit(0)
