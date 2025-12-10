/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.82758620689656, "KoPercent": 0.1724137931034483};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5751104565537555, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4325, 500, 1500, "https://demowebshop.tricentis.com/"], "isController": false}, {"data": [0.045, 500, 1500, "Registeration"], "isController": true}, {"data": [0.33163265306122447, 500, 1500, "https://demowebshop.tricentis.com/logout"], "isController": false}, {"data": [0.7908163265306123, 500, 1500, "https://demowebshop.tricentis.com/login"], "isController": false}, {"data": [0.6725, 500, 1500, "https://demowebshop.tricentis.com/register"], "isController": false}, {"data": [0.5510204081632653, 500, 1500, "https://demowebshop.tricentis.com/logout-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demowebshop.tricentis.com/logout-0"], "isController": false}, {"data": [0.36428571428571427, 500, 1500, "https://demowebshop.tricentis.com/search?q=book"], "isController": false}, {"data": [0.95, 500, 1500, "https://demowebshop.tricentis.com/register-1"], "isController": false}, {"data": [0.4030612244897959, 500, 1500, "Login"], "isController": true}, {"data": [0.805, 500, 1500, "https://demowebshop.tricentis.com/register-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1160, 2, 0.1724137931034483, 950.4525862068958, 99, 33671, 629.0, 1631.5000000000023, 2166.050000000001, 3789.1500000000187, 9.042789544664364, 177.5697938550932, 9.51166195850451], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demowebshop.tricentis.com/", 200, 1, 0.5, 1526.0549999999998, 321, 33181, 1029.5, 2180.5, 2868.4499999999966, 29058.940000000195, 1.9123566927703355, 65.88951217274796, 1.2764047156325597], "isController": false}, {"data": ["Registeration", 100, 0, 0.0, 2737.5100000000016, 1118, 37725, 2354.5, 3578.5000000000005, 3815.8499999999995, 37391.15999999983, 1.5453562046051614, 93.19394341098749, 5.689582005292846], "isController": true}, {"data": ["https://demowebshop.tricentis.com/logout", 98, 0, 0.0, 1409.3367346938778, 496, 3699, 1193.0, 2611.000000000001, 3324.85, 3699.0, 1.8487775430123756, 64.96178200696122, 3.217306232078177], "isController": false}, {"data": ["https://demowebshop.tricentis.com/login", 196, 0, 0.0, 729.4795918367344, 259, 31705, 383.5, 1105.8000000000002, 1417.4999999999975, 3402.340000000033, 3.4165983928042256, 76.43243012097548, 3.275851643802186], "isController": false}, {"data": ["https://demowebshop.tricentis.com/register", 200, 0, 0.0, 742.3499999999997, 287, 3205, 620.5, 1337.9, 1458.0, 2637.810000000004, 2.3066188427693266, 29.804871759200527, 3.2708148022939327], "isController": false}, {"data": ["https://demowebshop.tricentis.com/logout-1", 98, 0, 0.0, 851.826530612245, 311, 2676, 652.5, 1568.800000000001, 1982.9999999999993, 2676.0, 1.8572565667285752, 64.0064299217299, 1.6504916755107457], "isController": false}, {"data": ["https://demowebshop.tricentis.com/logout-0", 98, 0, 0.0, 556.887755102041, 180, 2147, 428.5, 1040.7, 1807.7999999999997, 2147.0, 1.8617728637106274, 1.25633305549223, 1.585415954253581], "isController": false}, {"data": ["https://demowebshop.tricentis.com/search?q=book", 70, 1, 1.4285714285714286, 2235.371428571428, 568, 33671, 1283.5, 2713.3999999999996, 4934.450000000004, 33671.0, 1.2464831368638485, 32.66857015029025, 1.1074884422076996], "isController": false}, {"data": ["https://demowebshop.tricentis.com/register-1", 100, 0, 0.0, 270.2299999999999, 99, 916, 199.5, 512.7000000000004, 708.6999999999995, 915.2299999999996, 1.892326615573848, 2.7627229397293975, 1.7592724004163118], "isController": false}, {"data": ["Login", 98, 0, 0.0, 1458.9591836734692, 551, 32021, 1028.5, 1905.2000000000012, 2573.5499999999993, 32021.0, 1.8255313600208631, 81.67761151109289, 3.500657214574446], "isController": true}, {"data": ["https://demowebshop.tricentis.com/register-0", 100, 0, 0.0, 461.9800000000001, 203, 1107, 411.5, 810.0, 961.8999999999988, 1106.7599999999998, 1.8698229277687402, 0.9531714534133617, 2.222825045343206], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, 100.0, 0.1724137931034483], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1160, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://demowebshop.tricentis.com/", 200, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/search?q=book", 70, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
