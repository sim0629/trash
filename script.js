/* sugang */

var inject = function(options) {
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
        id: $tds.eq(4).text(),
        number: $tds.eq(5).text(),
        total: +$tds.eq(12).text().split(" ")[0],
        current: +$tds.eq(14 - oddeven).text(),
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
};

chrome.storage.sync.get({
  student: { id: "0" },
  subjects: [],
}, function(value) {
  var s = document.createElement("script");
  s.innerHTML =
    "var options = " + JSON.stringify(value) + ";" +
    "var inject = " + inject + ";" +
    "inject(options);";
  s.onload = function() {
    this.parentNode.removeChild(this);
  };
  (document.head || document.documentElement).appendChild(s);
});
