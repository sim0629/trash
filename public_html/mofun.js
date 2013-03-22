/* mofun.js */

var unixtime = function(date) {
    return parseInt(date.getTime() / 1000);
};

var request = function(start, end, callback) {
    $.getJSON(["/history", start, end].join("/"),
        function(data) {
            if(!callback) return;
            var list = [["Num", "Jikan"]];
            var history = data["history"];
            if(!history) return;
            for(var i in history) {
                row = history[i];
                if(!row) continue;
                list.push([
                    row["num"],
                    row["jikan"]
                ]);
            }
            callback(list);
        }
    );
};

var init = function() {
    var options = {
    };

    var chart = new google.visualization.ScatterChart($("#chart")[0]);

    var end = unixtime(new Date());
    var start = end - 60 * 60;

    request(start, end, function(list) {
        var data = google.visualization.arrayToDataTable(list);
        chart.draw(data, options);
    });
};

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(init);
