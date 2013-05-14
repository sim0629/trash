/* mofun.js */

var unixtime = function(date) {
    return parseInt(date.getTime() / 1000);
};

var request = function(start, end, callback) {
    $.getJSON(["/history", start, end].join("/"),
        function(data) {
            if(!callback) return;
            var history = data["history"];
            if(!history) return;
            var id_count = data["id_count"];
            if(id_count == 0) {
                $("#loading").html(
                    "[IDLE] " + new Date(end * 1000)
                    + "<br />" +
                    "[Last Update] " + new Date(data["last_update"] * 1000)
                );
                return;
            }
            $("#loading").hide();
            var list = [new Array(id_count + 1)];
            for(var i in history) {
                row = history[i];
                if(!row) continue;
                var jikan_vector = new Array(id_count);
                jikan_vector[row["nise_id"]] = parseInt((end - row["jikan"]) / 6) / 10;
                list.push([row["num"]].concat(jikan_vector));
            }
            callback(list);
        }
    );
};

var init = function(s, n) {
    var end = unixtime(new Date()) - s * 60 * 60;
    var start = end - n * 60 * 60;

    var options = {
        title: new Date(end * 1000),
        chartArea: {
            top: 50,
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

    request(start, end, function(list) {
        var data = google.visualization.arrayToDataTable(list);
        chart.draw(data, options);
    });
};
