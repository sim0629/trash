# coding: utf-8

import sys

class Finder:
    def __init__(self, rival_ids):
        if not rival_ids:
            rival_ids = ["57710029431862"]
        self._rival_ids = rival_ids

    def run(self):
        pass

if __name__ == "__main__":
    finder = Finder(sys.argv[1:])
    finder.run()
    sys.exit(0)
