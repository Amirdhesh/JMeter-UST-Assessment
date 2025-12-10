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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.712280701754386, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.85, 500, 1500, "https://demowebshop.tricentis.com/cart"], "isController": false}, {"data": [0.8583333333333333, 500, 1500, "https://demowebshop.tricentis.com/register"], "isController": false}, {"data": [0.8583333333333333, 500, 1500, "https://demowebshop.tricentis.com/logout-1"], "isController": false}, {"data": [0.9083333333333333, 500, 1500, "https://demowebshop.tricentis.com/logout-0"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "https://demowebshop.tricentis.com/register-1"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "Login"], "isController": true}, {"data": [0.8, 500, 1500, "https://demowebshop.tricentis.com/register-0"], "isController": false}, {"data": [0.825, 500, 1500, "https://demowebshop.tricentis.com/"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "Registeration"], "isController": true}, {"data": [0.49166666666666664, 500, 1500, "https://demowebshop.tricentis.com/logout"], "isController": false}, {"data": [0.9, 500, 1500, "https://demowebshop.tricentis.com/login"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demowebshop.tricentis.com/search?q=book"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 480, 0, 0.0, 517.1541666666669, 147, 6040, 356.0, 1016.7, 1218.9499999999996, 2114.75, 1.3524898492819124, 27.46788232845216, 1.441423101090163], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demowebshop.tricentis.com/cart", 30, 0, 0.0, 481.86666666666673, 257, 2110, 290.5, 1641.1000000000022, 1972.4999999999998, 2110.0, 0.10972451830936462, 1.7823805054277062, 0.09793770481910086], "isController": false}, {"data": ["https://demowebshop.tricentis.com/register", 60, 0, 0.0, 508.38333333333327, 292, 2302, 363.5, 894.9999999999999, 1383.9499999999994, 2302.0, 0.19692792437967704, 2.544293397991335, 0.2793658510568465], "isController": false}, {"data": ["https://demowebshop.tricentis.com/logout-1", 60, 0, 0.0, 461.46666666666664, 316, 1932, 348.0, 756.9999999999999, 942.9499999999999, 1932.0, 0.19716736222930564, 6.794957239328316, 0.17521708948112122], "isController": false}, {"data": ["https://demowebshop.tricentis.com/logout-0", 60, 0, 0.0, 306.05, 181, 1060, 203.5, 560.0, 640.6999999999998, 1060.0, 0.19741647637911858, 0.12473482443094701, 0.1723538377763008], "isController": false}, {"data": ["https://demowebshop.tricentis.com/register-1", 30, 0, 0.0, 224.16666666666666, 147, 1442, 160.5, 321.3, 846.8999999999992, 1442.0, 0.11050415679803155, 0.16133175235650113, 0.10273433327316996], "isController": false}, {"data": ["Login", 30, 0, 0.0, 993.6666666666665, 548, 6322, 607.0, 1881.2000000000005, 3898.699999999997, 6322.0, 0.10954782310217526, 4.901266601059692, 0.2099666609458359], "isController": true}, {"data": ["https://demowebshop.tricentis.com/register-0", 30, 0, 0.0, 444.3000000000001, 194, 1387, 244.5, 1065.1000000000004, 1245.1, 1387.0, 0.11046834897687897, 0.05631296695891681, 0.13121712415905967], "isController": false}, {"data": ["https://demowebshop.tricentis.com/", 60, 0, 0.0, 573.9833333333332, 317, 2049, 444.0, 1076.8999999999999, 1272.1499999999996, 2049.0, 0.19123079325720221, 6.619685477136765, 0.12810969157660226], "isController": false}, {"data": ["Registeration", 30, 0, 0.0, 1537.2000000000003, 962, 3537, 1169.5, 2919.000000000001, 3237.7999999999997, 3537.0, 0.10945509604684679, 6.600441582903114, 0.40311684787565905], "isController": true}, {"data": ["https://demowebshop.tricentis.com/logout", 60, 0, 0.0, 768.45, 500, 2135, 563.5, 1215.6999999999998, 1451.2499999999998, 2135.0, 0.19703656998738966, 6.914944546520334, 0.3471230197824716], "isController": false}, {"data": ["https://demowebshop.tricentis.com/login", 60, 0, 0.0, 496.81666666666666, 265, 6040, 298.5, 1058.7999999999997, 1379.0499999999988, 6040.0, 0.2161866122837233, 4.836190224401704, 0.2071788367719015], "isController": false}, {"data": ["Test", 30, 0, 0.0, 6070.966666666667, 4261, 11298, 5331.5, 9920.600000000004, 10756.25, 11298.0, 0.10752495474991489, 27.180887495295785, 1.2269815393093313], "isController": true}, {"data": ["https://demowebshop.tricentis.com/search?q=book", 30, 0, 0.0, 893.8333333333334, 541, 3025, 907.5, 1075.8, 2242.8999999999987, 3025.0, 0.10954462300217993, 2.907318573564692, 0.09873992874122274], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 480, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
