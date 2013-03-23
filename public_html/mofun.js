/* mofun.js */

var unixtime = function(date) {
    return parseInt(date.getTime() / 1000);
};

var request = function(start, end, callback) {
    $.getJSON(["/history", start, end].join("/"),
        function(data) {
            if(!callback) return;
            var list = [["", ""]];
            var history = data["history"];
            if(!history) return;
            for(var i in history) {
                row = history[i];
                if(!row) continue;
                list.push([
                    row["num"],
                    parseInt((unixtime(new Date()) - row["jikan"]) / 6) / 10
                ]);
            }
            callback(list);
        }
    );
};

var init = function(n) {
    var options = {
        title: new Date(),
        chartArea: {
            width: "85%",
            height: "85%"
        },
        hAxis: {
            minValue: 1,
            maxValue: 6,
            gridlines: {
                count: 6
            }
        },
        vAxis: {
            minValue: 0,
            maxValue: n * 60,
            direction: -1,
            gridlines: {
                count: n * 6 + 1
            }
        },
        legend: "none"
    };

    var chart = new google.visualization.ScatterChart($("#chart")[0]);

    var end = unixtime(new Date());
    var start = end - n * 60 * 60;

    request(start, end, function(list) {
        var data = google.visualization.arrayToDataTable(list);
        chart.draw(data, options);
    });
};

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(function() { init(1); });
