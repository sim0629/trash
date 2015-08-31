/* sugang */

var ocr = function() {
  // struct Point
  var newPoint = function(x, y) {
    return {
      "x": x,
      "y": y,
    };
  };
  var copyPoint = function(other) {
    return {
      "x": other.x,
      "y": other.y,
    };
  };

  // struct Color
  var newColor = function(r, g, b) {
    return {
      "r": r,
      "g": g,
      "b": b,
    };
  };
  var copyColor = function(other) {
    return {
      "r": other.r,
      "g": other.g,
      "b": other.b,
    };
  };
  var sameColor = function(lhs, rhs) {
    return lhs.r == rhs.r
      && lhs.g == rhs.g
      && lhs.b == rhs.b;
  };

  // struct capture_result
  var CaptureResult = function() {
    this.buffer = [];
    this.width = 0;
    this.height = 0;
    this.get = function(x, y) {
      return this.buffer[y * this.width + x];
    };
  };

  var captureScreen = function() {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var img = document.getElementById('imageText');
    context.drawImage(img, 0, 0);
    var data = context.getImageData(0, 0, img.width, img.height).data;
    var cr = new CaptureResult();
    cr.width = img.width;
    cr.height = img.height;
    var idx;
    for(idx = 0; idx < data.length; idx += 4) {
      cr.buffer.push(newColor(data[idx], data[idx + 1], data[idx + 2]));
    }
    return cr;
  };

  var floodFill = function(data, width, height, r, c, fillColor) {
    var q = [];
    var fillCount = 0;
    data[r * width + c] = fillColor;
    fillCount++;
    q.push([r, c]);
    var dir = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    while(q.length > 0) {
      var qh = q.shift();
      var i;
      for(i = 0; i < 4; i++) {
        var nr = qh[0] + dir[i][0];
        var nc = qh[1] + dir[i][1];
        if(nr < 0 || nc < 0 || nr >= height || nc >= width) continue;
        if(data[nr * width + nc] == -1) {
          data[nr * width + nc] = fillColor;
          fillCount++;
          q.push([nr, nc]);
        }
      }
    }
    return fillCount;
  };

  var countHoles = function(data, width, threshold) {
    data = data.slice(0);
    var height = parseInt(data.length / width);
    var holes = -1;
    var largestAreaIndex = 1, largestArea = -1;
    var minY = height + 1, maxY = -1;
    var i, j;
    for(i = 0; i < height; i++) {
      for(j = 0; j < width; j++) {
        if(data[i * width + j] == -1) {
          var cnt = floodFill(data, width, height, i, j, holes + 3);
          if(cnt >= threshold) {
            if(cnt >= largestArea) {
              largestArea = cnt;
              largestAreaIndex = holes + 3;
            }
            holes++;
          }
        }else if(data[i * width + j] == 0) {
          minY = Math.min(minY, i);
          maxY = Math.max(maxY, i);
        }
      }
    }
    var hsum = 0;
    var hcnt = 0;
    for(i = 0; i < height; i++) {
      for(j = 0; j < width; j++) {
        if(data[i * width + j] == largestAreaIndex || data[i * width + j] == -1 || data[i * width + j] == 0) continue;
        hsum +=i;
        hcnt++;
      }
    }
    if(holes == 1) {
      return [holes, (hsum / hcnt - minY) / (maxY - minY)];
    }
    return [holes, 0];
  };

  var digits =
  [
    [
      ".....ooo............",
      "...oo...oo..........",
      "...o.....o..........",
      "..o.......o.........",
      "..o.......o.........",
      "..o.......o.........",
      "..o.......o.........",
      "..o.......o.........",
      "..o.......o.........",
      "...o.....o..........",
      "....o...oo..........",
      ".....ooo............",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
    ],
    [
      "....................",
      "....................",
      "....oo..............",
      "...o.o..............",
      ".....o..............",
      ".....o..............",
      ".....o..............",
      ".....o..............",
      ".....o..............",
      ".....o..............",
      ".....o..............",
      ".....o..............",
      ".....o..............",
      "...ooooo............",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
    ],
    [
      "....................",
      "....................",
      "....................",
      "....oooo............",
      "...o....o...........",
      "........o...........",
      "........o...........",
      "........o...........",
      ".......o............",
      "......o.............",
      ".....o..............",
      "....o...............",
      "...o................",
      "...oooooo...........",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
    ],
    [
      "....................",
      "....................",
      "....ooooo...........",
      "...o.....o..........",
      ".........o..........",
      ".........o..........",
      "........o...........",
      "....oooo............",
      "........o...........",
      ".........o..........",
      ".........o..........",
      ".........o..........",
      "...o....o...........",
      "....oooo............",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
    ],
    [
      "....................",
      "....................",
      "....................",
      "....................",
      ".........o..........",
      "........oo..........",
      ".......o.o..........",
      "......o..o..........",
      "......o..o..........",
      ".....o...o..........",
      "....o....o..........",
      "...o.....o..........",
      "...ooooooooo........",
      ".........o..........",
      ".........o..........",
      ".........o..........",
      "....................",
      "....................",
      "....................",
      "....................",
    ],
    [
      "....................",
      "....................",
      "....ooooooo.........",
      "....o...............",
      "....o...............",
      "....o...............",
      "....o...............",
      "....oooo............",
      "........oo..........",
      "..........o.........",
      "..........o.........",
      "..........o.........",
      "....o....o..........",
      ".....oooo...........",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
    ],
    [
      "....................",
      "....................",
      "....oooo............",
      "...o....o...........",
      "..o.................",
      "..o.................",
      "..o.ooo.............",
      "..oo...o............",
      "..o.....o...........",
      "..o.....o...........",
      "..o.....o...........",
      "...o...o............",
      "....ooo.............",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
    ],
    [
      "....................",
      "....................",
      "..oooooooo..........",
      ".........o..........",
      "........o...........",
      ".......o............",
      ".......o............",
      "......o.............",
      ".....o..............",
      ".....o..............",
      "....o...............",
      "....o...............",
      "...o................",
      "...o................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
    ],
    [
      "....................",
      "..88888888888888888.",
      "..888888888.........",
      ".8888888888888......",
      "..88888888888.......",
      "..88888888888.......",
      ".88888888888........",
      ".88888888888........",
      ".888888888888.......",
      ".888888888888.......",
      "..888888888888888...",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
    ],
    [
      "....................",
      "....ooo.............",
      "...o...o............",
      "..o.....o...........",
      "..o.....o...........",
      "..o.....o...........",
      "...o...oo...........",
      "....ooo.o...........",
      "........o...........",
      "........o...........",
      "..o....o............",
      "...oooo.............",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
      "....................",
    ]
  ];

  var digits5alt =
  [
    "....................",
    "....................",
    "...oooooo...........",
    "...o................",
    "...o................",
    "...ooooo............",
    ".......oo...........",
    ".......oo...........",
    ".......oo...........",
    "...o...oo...........",
    "....ooo.............",
    "....................",
    "....................",
    "....................",
    "....................",
    "....................",
    "....................",
    "....................",
    "....................",
    "....................",
  ];

  var getX = function(x, y, rad) {
    return Math.cos(rad) * x - Math.sin(rad) * y;
  };

  var getY = function(x, y, rad) {
    return Math.sin(rad) * x + Math.cos(rad) * y;
  }

  var getScoreInternal = function(digits, data, width, height) {
    var best = -1e60;
    var rad;
    var i, j;
    var r, c;
    for(rad = -0.35; rad <= 0.35; rad += 0.5) {
      var minX = 1e60, minY = 1e60, maxX = -1e60, maxY = -1e60;
      var iminX = width, iminY = height, imaxX = 0, imaxY = 0;
      for(j = 0; j < height; j++) {
        for(i = 0; i < width; i++) {
          if(data[j * width + i] == 0) {
            minX = Math.min(minX, getX(i, j, rad));
            minY = Math.min(minY, getY(i, j, rad));
            maxX = Math.max(maxX, getX(i, j, rad));
            maxY = Math.max(maxY, getY(i, j, rad));
            iminX = Math.min(iminX, i);
            iminY = Math.min(iminY, j);
            imaxX = Math.max(imaxX, i);
            imaxY = Math.max(imaxY, j);
          }
        }
      }
      if(minX > maxX || minY > maxY) return -2147483648;
      var dminX = 20, dminY = 20, dmaxX = 0, dmaxY = 0;
      for(r = 0; r < 20; r++) {
        for(c = 0; c < 20; c++) {
          if(digits[r][c] != '.') {
            dminX = Math.min(dminX, c);
            dminY = Math.min(dminY, r);
            dmaxX = Math.max(dmaxX, c);
            dmaxY = Math.max(dmaxY, r);
          }
        }
      }
      var matches = [];
      for(j = iminY; j <= imaxY; j++) {
        for(i = iminX; i <= imaxX; i++) {
          if(data[j * width + i] == 0) {
            var rx = (getX(i, j, rad) - minX) / (maxX - minX);
            var ry = (getY(i, j, rad) - minY) / (maxY - minY);
            var minDist = 1e60;
            var minDistPos = [0, 0];
            for(r = dminY; r <= dmaxY; r++) {
              for(c = dminX; c <= dmaxX; c++) {
                if(digits[r][c] != '.') {
                  var drx = (c - dminX) / (dmaxX - dminX);
                  var dry = (r - dminY) / (dmaxY - dminY);
                  var dd = Math.hypot(rx - drx, ry - dry);
                  if(minDist > dd) {
                    minDist = dd;
                    minDistPos = [r, c];
                  }
                }
              }
            }
            matches.push(["" + minDistPos, minDist]);
          }
        }
      }
      var weight = {};
      var score = 0;
      var weightScore = 0;
      var kv;
      for(i in matches) {
        kv = matches[i];
        weightScore += Math.exp(-Math.pow(kv[1] * 10, 3));
        score += kv[1];
        if(!weight[kv[0]]) weight[kv[0]] = 0;
        weight[kv[0]]++;
      }
      var dev = 0, dev2 = 0;
      for(i in matches) {
        kv = matches[i];
        dev2 += Math.pow(kv[1] - score / matches.length, 2);
      }
      dev2 /= matches.length;
      var scnt = 0;
      for(r = dminY; r <= dmaxY; r++) {
        for(c = dminX; c <= dmaxX; c++) {
          if(digits[r][c] != '.') {
            scnt++;
          }
        }
      }
      for(r = dminY; r <= dmaxY; r++) {
        for(c = dminX; c <= dmaxX; c++) {
          if(digits[r][c] != '.') {
            var key = "" + [r, c];
            if(!weight[key]) weight[key] = 0;
            dev += Math.pow(weight[key] - matches.length / scnt, 2);
          }
        }
      }
      dev /= scnt;
      best = Math.max(best, weightScore / dev / dev2);
    }
    return best;
  };

  var getScore = function(data, width, height, digitIndex) {
    var res = getScoreInternal(digits[digitIndex], data, width, height);
    if(digitIndex == 5) {
      res = Math.max(res, getScoreInternal(digits5alt, data, width, height));
    }
    return res;
  };

  var ocrDigit = function(data, width, height) {
    var holeInfo = countHoles(data, width, 3);
    var holes = holeInfo[0];
    var holePos = holeInfo[1];
    if(holes == 2) return 8;
    if(holes == 1) {
      if(holePos < 0.35) return 9;
      if(holePos > 0.60) return 6;
      var score0 = getScore(data, width, height, 0);
      var score4 = getScore(data, width, height, 4);
      var maxScore = Math.max(score0, score4);
      if(maxScore == score0) return 0;
      if(maxScore == score4) return 4;
    }
    if(holes == 0) {
      var score1 = getScore(data, width, height, 1);
      var score2 = getScore(data, width, height, 2);
      var score3 = getScore(data, width, height, 3);
      var score5 = getScore(data, width, height, 5);
      var score7 = getScore(data, width, height, 7);
      var maxScore = Math.max(score1, score2, score3, score5, score7);
      if(maxScore == score1) return 1;
      if(maxScore == score2) return 2;
      if(maxScore == score3) return 3;
      if(maxScore == score5) return 5;
      if(maxScore == score7) return 7;
    }
    return -1;
  };

  var processOcr = function(capture, x1, y1, x2, y2) {
    var background = newColor(192, 192, 192);
	  var background2 = newColor(140, 140, 140);
	  var white = newColor(255, 255, 255);

    var width = x2 - x1 + 1;
    var height = y2 - y1 + 1;

    var data1 = [];
    var data2 = [];
    var i, j;
    for(i = 0; i < width; i++) {
      for(j = 0; j < height; j++) {
        data1.push(-1);
        data2.push(-1);
      }
    }

    var color1 = newColor(0, 0, 0), color2 = newColor(0, 0, 0);
    var found1 = false, found2 = false;
    var x, y;
    for(x = x1; x <= x2; x++) {
      for(y = y1; y <= y2; y++) {
        var cur = capture.get(x, y);
        if(!sameColor(cur, background) && !sameColor(cur, background2) && !sameColor(cur, white)) {
          if (found1 && !sameColor(color1, cur)) {
            color2 = cur;
            found2 = true;
          }else if(!found1) {
            color1 = cur;
            found1 = true;
          }
        }

        if (found1 && sameColor(cur, color1)) {
          data1[(y - y1) * width + (x - x1)] = 0;
        }
        if (found2 && sameColor(cur, color2)) {
          data2[(y - y1) * width + (x - x1)] = 0;
        }
      }
    }

    var r1 = ocrDigit(data1, width, height);
    var r2 = ocrDigit(data2, width, height);

    return [r1, r2];
  };

  this.main = function() {
    var capture = captureScreen();
    var res = processOcr(capture, 0, 0, 51, 25);
    if(res[0] == -1 || res[1] == -1) {
      console.error(res);
      return "42";
    }
    return "" + res[0] + res[1];
  };

  return this;
};

var inject = function(options, ocr) {
  var patchAlertFunction = function() {
    window.alert = function(message) { console.log(message); };
  };
  if(options.misc.alertDisabled)
    patchAlertFunction();

  var patchMenuLink = function() {
    fnMenu(1, 0);
    $("#submenu02 a").eq(2).attr("href", "/sugang/ca/ca103.action");
  };
  patchMenuLink();

  var patchSubmitButton = function() {
    return $("#CA103, #CA202")
      .submit(function() {
        fnCourseApproveCheck();
        return false;
      });
  };
  if(!patchSubmitButton().length) return;

  var $orders = $(options.subjects);
  var oddeven = parseInt(options.student.id);

  var $candidates = $(".tab_cont tbody input[type=checkbox]")
    .parent()
    .parent()
    .map(function(index, tr) {
      var $tr = $(tr);
      var $tds = $tr.children();
      return {
        index: index,
        id: $tds.eq(5).text(),
        number: $tds.eq(6).text(),
        total: +$tds.eq(13).text().split(" ")[0],
        current: +$tds.eq(15 - oddeven).text(),
      };
    });

  var $registered = $(".apply_cont ~ .tbl_sec tbody input[type=checkbox]")
    .parent()
    .parent()
    .map(function(index, tr) {
      var $tr = $(tr);
      var $tds = $tr.children();
      return {
        id: $tds.eq(1).text(),
        number: $tds.eq(2).text(),
      };
    });

  var isIn = function(object, array) {
    var i, item;
    for(i = 0; i < array.length; i++) {
      item = array[i];
      if(item.id === object["id"] && item.number === object["number"])
        return item;
    }
    return null;
  };

  var isFull = function(object) {
    var half = parseInt(object["total"] / 2);
    return object["current"] >= half;
  };
  var findNextIndex = function() {
    var i, order;
    for(i = 0; i < $orders.length; i++) {
      order = $orders[i];
      var candidate = isIn(order, $candidates);
      if(!candidate) continue;
      if(isIn(order, $registered)) {
        $(".tab_cont tbody input[type=checkbox]")
          .eq(candidate.index)
          .parent()
          .css("background-color", "green");
        continue;
      }
      if(isFull(candidate)) {
        $(".tab_cont tbody input[type=checkbox]")
          .eq(candidate.index)
          .parent()
          .css("background-color", "red");
        continue;
      }
      return candidate.index;
    }
    return -1;
  };
  var nextIndex = findNextIndex();
  if(nextIndex >= 0) {
    $(".tab_cont tbody input[type=checkbox]")
      .eq(nextIndex)
      .click();
  }
  $("#imageText").on("load", function() {
    $("#inputTextView").val(ocr.main());
    //fnCourseApproveCheck();
  });
};

chrome.storage.sync.get({
  student: { id: "0" },
  subjects: [],
  misc: {},
}, function(value) {
  var s = document.createElement("script");
  s.innerHTML =
    "var options = " + JSON.stringify(value) + ";" +
    "var ocr = " + ocr + ";" +
    "var inject = " + inject + ";" +
    "inject(options, ocr());";
  s.onload = function() {
    this.parentNode.removeChild(this);
  };
  (document.head || document.documentElement).appendChild(s);
});
