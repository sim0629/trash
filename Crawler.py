# coding: utf-8

import BeautifulSoup
import datetime
import re
import sys
import time
import urllib2

class Crawler:
    def __init__(self, ssid, rivalid_file):
        self._url_format = "http://p.eagate.573.jp/game/jubeat/saucer/s/playdata/history.html?rival_id=%s&page=%d"
        self._opener = urllib2.build_opener()
        self._opener.addheaders.append(('Cookie', 'M573SSID=%s' % ssid))
        self._center_class = re.compile(r'\bcenter\b')
        f = open(rivalid_file, "r")
        self._rivalids = f.readlines()
        f.close()

    def _save(self, rival_id, data):
        soup = BeautifulSoup.BeautifulSoup(data)
        div = soup.find("div", { "id" : "history" })
        if div and div.find("div", { "class" : self._center_class }):
            return False # not open
        f = open("data/" + rival_id, "a")
        f.write(str(soup))
        f.close()
        return True

    def _crawl(self, rival_id):
        for page_num in [1, 2, 3]:
            url = self._url_format % (rival_id, page_num)
            while True:
                try:
                    data = self._opener.open(url)
                    break
                except KeyboardInterrupt:
                    sys.exit(1)
                except:
                    sys.stderr.write(str(sys.exc_info()[0]))
                    sys.stderr.write("\n")
            if not self._save(rival_id, data):
                break

    def run(self):
        if not self._rivalids:
            return
        n = 0
        for rivalid in self._rivalids:
            n += 1
            rival_id = rivalid.strip()
            d = datetime.datetime.now()
            if d.hour == 4 and d.minute > 50: # 573 maintain
                time.sleep((2 * 60 + 20) * 60)
            print n, rival_id
            self._crawl(rival_id)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "ssid missing."
        sys.exit(1)
    elif len(sys.argv) < 3:
        print "rivalid file missing."
        sys.exit(1)
    crawler = Crawler(sys.argv[1], sys.argv[2])
    crawler.run()
    sys.exit(0)
