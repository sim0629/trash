# coding: utf-8

import sys
import Queue

class Finder:
    def __init__(self, rival_ids):
        if not rival_ids:
            rival_ids = ["57710029431862"]
        self._q = Queue.Queue()
        self._d = {}
        for rival_id in rival_ids:
            self._enqueue(rival_id)

    def _enqueue(self, rival_id):
        if rival_id in self._d:
            return
        self._q.put(rival_id)
        self._d[rival_id] = True

    def _crawl(self, rival_id):
        return

    def run(self):
        while not self._q.empty():
            rival_id = self._q.get()
            self._crawl(rival_id)

if __name__ == "__main__":
    finder = Finder(sys.argv[1:])
    finder.run()
    sys.exit(0)
