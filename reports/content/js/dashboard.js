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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6801762114537445, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8571428571428571, 500, 1500, "https://demowebshop.tricentis.com/cart"], "isController": false}, {"data": [0.8188976377952756, 500, 1500, "https://demowebshop.tricentis.com/register"], "isController": false}, {"data": [0.8275862068965517, 500, 1500, "https://demowebshop.tricentis.com/logout-1"], "isController": false}, {"data": [0.9310344827586207, 500, 1500, "https://demowebshop.tricentis.com/logout-0"], "isController": false}, {"data": [0.9836065573770492, 500, 1500, "https://demowebshop.tricentis.com/register-1"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "Login"], "isController": true}, {"data": [0.9016393442622951, 500, 1500, "https://demowebshop.tricentis.com/register-0"], "isController": false}, {"data": [0.6062992125984252, 500, 1500, "https://demowebshop.tricentis.com/"], "isController": false}, {"data": [0.3114754098360656, 500, 1500, "Registeration"], "isController": true}, {"data": [0.4525862068965517, 500, 1500, "https://demowebshop.tricentis.com/logout"], "isController": false}, {"data": [0.8541666666666666, 500, 1500, "https://demowebshop.tricentis.com/login"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.43103448275862066, 500, 1500, "https://demowebshop.tricentis.com/search?q=book"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 958, 0, 0.0, 987.3444676409196, 144, 296753, 405.5, 1250.2, 1730.8499999999992, 3801.3999999999987, 1.5992414453937507, 32.5332574507457, 1.695809680669211], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demowebshop.tricentis.com/cart", 56, 0, 0.0, 1008.3035714285718, 260, 31524, 337.5, 841.5000000000023, 1437.5999999999995, 31524.0, 0.11167970261290618, 1.8141407942022278, 0.09968285955878539], "isController": false}, {"data": ["https://demowebshop.tricentis.com/register", 127, 0, 0.0, 604.8267716535435, 288, 3975, 395.0, 1015.4000000000001, 2092.7999999999975, 3668.119999999999, 0.21526554785081928, 2.8740172020690915, 0.2994546244167066], "isController": false}, {"data": ["https://demowebshop.tricentis.com/logout-1", 116, 0, 0.0, 555.1206896551726, 317, 3444, 399.5, 974.5999999999998, 1308.7999999999995, 3188.4899999999975, 0.21553085621490656, 7.427816324046926, 0.1915362101128564], "isController": false}, {"data": ["https://demowebshop.tricentis.com/logout-0", 116, 0, 0.0, 343.905172413793, 177, 4753, 222.5, 610.9, 686.4999999999998, 4170.919999999995, 0.21573809395393992, 0.13663073589007774, 0.18818964122383014], "isController": false}, {"data": ["https://demowebshop.tricentis.com/register-1", 61, 0, 0.0, 213.70491803278688, 144, 1824, 159.0, 322.00000000000006, 399.0, 1824.0, 0.11005883637137821, 0.16068160192891642, 0.10232032443901568], "isController": false}, {"data": ["Login", 60, 0, 0.0, 1314.2833333333333, 558, 19816, 704.5, 2459.4999999999995, 2936.4999999999986, 19816.0, 0.11133894357899034, 4.981402917080322, 0.21339964185973148], "isController": true}, {"data": ["https://demowebshop.tricentis.com/register-0", 61, 0, 0.0, 426.9016393442622, 195, 3825, 247.0, 802.8000000000006, 1385.5999999999995, 3825.0, 0.11005228385551037, 0.05610087126228165, 0.130720562254412], "isController": false}, {"data": ["https://demowebshop.tricentis.com/", 127, 0, 0.0, 927.204724409449, 309, 3785, 861.0, 1678.2000000000003, 2216.9999999999995, 3668.24, 0.21227909184664423, 7.34957918699615, 0.1407413251814819], "isController": false}, {"data": ["Registeration", 61, 0, 0.0, 1792.9344262295085, 994, 6015, 1274.0, 3402.8000000000006, 4322.4, 6015.0, 0.10969289585648571, 6.614781561658197, 0.4039903094868171], "isController": true}, {"data": ["https://demowebshop.tricentis.com/logout", 116, 0, 0.0, 899.8793103448273, 507, 5586, 645.0, 1489.1999999999991, 2058.8999999999996, 5330.829999999997, 0.21545319465081725, 7.561590186199852, 0.37940831630757804], "isController": false}, {"data": ["https://demowebshop.tricentis.com/login", 120, 0, 0.0, 657.1416666666669, 269, 18994, 328.5, 1067.7000000000003, 1753.8, 15580.86999999987, 0.22116554240849276, 4.947571095506653, 0.21195031147480553], "isController": false}, {"data": ["Test", 56, 0, 0.0, 13430.232142857143, 5065, 303445, 6379.5, 13068.100000000004, 32780.89999999998, 303445.0, 0.10847205488685978, 27.420299370765235, 1.2377814583486682], "isController": true}, {"data": ["https://demowebshop.tricentis.com/search?q=book", 58, 0, 0.0, 6348.896551724139, 535, 296753, 1089.5, 1750.4000000000005, 2770.1999999999925, 296753.0, 0.11097759783249271, 2.9453497815367715, 0.10003156523378004], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 958, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
