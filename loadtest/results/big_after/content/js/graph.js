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
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 32.0, "minX": 0.0, "maxY": 1902.0, "series": [{"data": [[0.0, 32.0], [0.1, 35.0], [0.2, 37.0], [0.3, 39.0], [0.4, 39.0], [0.5, 40.0], [0.6, 41.0], [0.7, 42.0], [0.8, 42.0], [0.9, 43.0], [1.0, 44.0], [1.1, 45.0], [1.2, 45.0], [1.3, 45.0], [1.4, 46.0], [1.5, 46.0], [1.6, 47.0], [1.7, 47.0], [1.8, 48.0], [1.9, 48.0], [2.0, 49.0], [2.1, 50.0], [2.2, 50.0], [2.3, 51.0], [2.4, 51.0], [2.5, 51.0], [2.6, 52.0], [2.7, 52.0], [2.8, 53.0], [2.9, 53.0], [3.0, 54.0], [3.1, 54.0], [3.2, 54.0], [3.3, 55.0], [3.4, 55.0], [3.5, 55.0], [3.6, 56.0], [3.7, 56.0], [3.8, 56.0], [3.9, 56.0], [4.0, 57.0], [4.1, 57.0], [4.2, 57.0], [4.3, 57.0], [4.4, 58.0], [4.5, 58.0], [4.6, 58.0], [4.7, 58.0], [4.8, 58.0], [4.9, 58.0], [5.0, 58.0], [5.1, 59.0], [5.2, 59.0], [5.3, 59.0], [5.4, 59.0], [5.5, 59.0], [5.6, 59.0], [5.7, 60.0], [5.8, 60.0], [5.9, 60.0], [6.0, 60.0], [6.1, 60.0], [6.2, 60.0], [6.3, 61.0], [6.4, 61.0], [6.5, 61.0], [6.6, 61.0], [6.7, 61.0], [6.8, 61.0], [6.9, 62.0], [7.0, 62.0], [7.1, 62.0], [7.2, 62.0], [7.3, 62.0], [7.4, 62.0], [7.5, 62.0], [7.6, 63.0], [7.7, 63.0], [7.8, 63.0], [7.9, 63.0], [8.0, 63.0], [8.1, 63.0], [8.2, 64.0], [8.3, 64.0], [8.4, 64.0], [8.5, 64.0], [8.6, 64.0], [8.7, 65.0], [8.8, 65.0], [8.9, 65.0], [9.0, 65.0], [9.1, 65.0], [9.2, 65.0], [9.3, 65.0], [9.4, 66.0], [9.5, 66.0], [9.6, 66.0], [9.7, 66.0], [9.8, 66.0], [9.9, 66.0], [10.0, 67.0], [10.1, 67.0], [10.2, 67.0], [10.3, 67.0], [10.4, 67.0], [10.5, 67.0], [10.6, 68.0], [10.7, 68.0], [10.8, 68.0], [10.9, 68.0], [11.0, 68.0], [11.1, 69.0], [11.2, 69.0], [11.3, 69.0], [11.4, 69.0], [11.5, 69.0], [11.6, 69.0], [11.7, 69.0], [11.8, 70.0], [11.9, 70.0], [12.0, 70.0], [12.1, 70.0], [12.2, 70.0], [12.3, 70.0], [12.4, 71.0], [12.5, 71.0], [12.6, 71.0], [12.7, 71.0], [12.8, 71.0], [12.9, 71.0], [13.0, 72.0], [13.1, 72.0], [13.2, 72.0], [13.3, 72.0], [13.4, 72.0], [13.5, 72.0], [13.6, 72.0], [13.7, 72.0], [13.8, 73.0], [13.9, 73.0], [14.0, 73.0], [14.1, 73.0], [14.2, 73.0], [14.3, 73.0], [14.4, 74.0], [14.5, 74.0], [14.6, 74.0], [14.7, 74.0], [14.8, 74.0], [14.9, 74.0], [15.0, 74.0], [15.1, 74.0], [15.2, 75.0], [15.3, 75.0], [15.4, 75.0], [15.5, 75.0], [15.6, 75.0], [15.7, 75.0], [15.8, 76.0], [15.9, 76.0], [16.0, 76.0], [16.1, 76.0], [16.2, 76.0], [16.3, 76.0], [16.4, 76.0], [16.5, 77.0], [16.6, 77.0], [16.7, 77.0], [16.8, 77.0], [16.9, 77.0], [17.0, 78.0], [17.1, 78.0], [17.2, 78.0], [17.3, 78.0], [17.4, 78.0], [17.5, 78.0], [17.6, 78.0], [17.7, 79.0], [17.8, 79.0], [17.9, 79.0], [18.0, 79.0], [18.1, 79.0], [18.2, 79.0], [18.3, 79.0], [18.4, 79.0], [18.5, 79.0], [18.6, 80.0], [18.7, 80.0], [18.8, 80.0], [18.9, 80.0], [19.0, 80.0], [19.1, 80.0], [19.2, 80.0], [19.3, 80.0], [19.4, 81.0], [19.5, 81.0], [19.6, 81.0], [19.7, 81.0], [19.8, 81.0], [19.9, 81.0], [20.0, 81.0], [20.1, 82.0], [20.2, 82.0], [20.3, 82.0], [20.4, 82.0], [20.5, 82.0], [20.6, 83.0], [20.7, 83.0], [20.8, 83.0], [20.9, 83.0], [21.0, 83.0], [21.1, 84.0], [21.2, 84.0], [21.3, 84.0], [21.4, 84.0], [21.5, 84.0], [21.6, 84.0], [21.7, 85.0], [21.8, 85.0], [21.9, 85.0], [22.0, 85.0], [22.1, 85.0], [22.2, 85.0], [22.3, 86.0], [22.4, 86.0], [22.5, 86.0], [22.6, 86.0], [22.7, 86.0], [22.8, 86.0], [22.9, 87.0], [23.0, 87.0], [23.1, 87.0], [23.2, 87.0], [23.3, 87.0], [23.4, 87.0], [23.5, 87.0], [23.6, 88.0], [23.7, 88.0], [23.8, 88.0], [23.9, 88.0], [24.0, 88.0], [24.1, 88.0], [24.2, 89.0], [24.3, 89.0], [24.4, 89.0], [24.5, 89.0], [24.6, 89.0], [24.7, 89.0], [24.8, 89.0], [24.9, 89.0], [25.0, 89.0], [25.1, 90.0], [25.2, 90.0], [25.3, 90.0], [25.4, 90.0], [25.5, 90.0], [25.6, 90.0], [25.7, 90.0], [25.8, 91.0], [25.9, 91.0], [26.0, 91.0], [26.1, 91.0], [26.2, 91.0], [26.3, 91.0], [26.4, 92.0], [26.5, 92.0], [26.6, 92.0], [26.7, 92.0], [26.8, 92.0], [26.9, 93.0], [27.0, 93.0], [27.1, 93.0], [27.2, 93.0], [27.3, 93.0], [27.4, 93.0], [27.5, 94.0], [27.6, 94.0], [27.7, 94.0], [27.8, 94.0], [27.9, 94.0], [28.0, 94.0], [28.1, 95.0], [28.2, 95.0], [28.3, 95.0], [28.4, 95.0], [28.5, 95.0], [28.6, 95.0], [28.7, 96.0], [28.8, 96.0], [28.9, 96.0], [29.0, 96.0], [29.1, 96.0], [29.2, 96.0], [29.3, 96.0], [29.4, 97.0], [29.5, 97.0], [29.6, 97.0], [29.7, 97.0], [29.8, 97.0], [29.9, 97.0], [30.0, 98.0], [30.1, 98.0], [30.2, 98.0], [30.3, 98.0], [30.4, 98.0], [30.5, 98.0], [30.6, 98.0], [30.7, 98.0], [30.8, 98.0], [30.9, 98.0], [31.0, 99.0], [31.1, 99.0], [31.2, 99.0], [31.3, 99.0], [31.4, 99.0], [31.5, 99.0], [31.6, 99.0], [31.7, 100.0], [31.8, 100.0], [31.9, 100.0], [32.0, 100.0], [32.1, 100.0], [32.2, 101.0], [32.3, 101.0], [32.4, 101.0], [32.5, 101.0], [32.6, 101.0], [32.7, 101.0], [32.8, 101.0], [32.9, 102.0], [33.0, 102.0], [33.1, 102.0], [33.2, 102.0], [33.3, 102.0], [33.4, 102.0], [33.5, 102.0], [33.6, 103.0], [33.7, 103.0], [33.8, 103.0], [33.9, 103.0], [34.0, 103.0], [34.1, 104.0], [34.2, 104.0], [34.3, 104.0], [34.4, 105.0], [34.5, 105.0], [34.6, 105.0], [34.7, 105.0], [34.8, 106.0], [34.9, 106.0], [35.0, 106.0], [35.1, 106.0], [35.2, 106.0], [35.3, 106.0], [35.4, 107.0], [35.5, 107.0], [35.6, 107.0], [35.7, 107.0], [35.8, 107.0], [35.9, 107.0], [36.0, 108.0], [36.1, 108.0], [36.2, 108.0], [36.3, 108.0], [36.4, 108.0], [36.5, 109.0], [36.6, 109.0], [36.7, 109.0], [36.8, 109.0], [36.9, 109.0], [37.0, 109.0], [37.1, 110.0], [37.2, 110.0], [37.3, 110.0], [37.4, 110.0], [37.5, 111.0], [37.6, 111.0], [37.7, 111.0], [37.8, 111.0], [37.9, 111.0], [38.0, 111.0], [38.1, 112.0], [38.2, 112.0], [38.3, 112.0], [38.4, 112.0], [38.5, 113.0], [38.6, 113.0], [38.7, 113.0], [38.8, 113.0], [38.9, 113.0], [39.0, 114.0], [39.1, 114.0], [39.2, 114.0], [39.3, 114.0], [39.4, 114.0], [39.5, 115.0], [39.6, 115.0], [39.7, 115.0], [39.8, 115.0], [39.9, 115.0], [40.0, 116.0], [40.1, 116.0], [40.2, 116.0], [40.3, 116.0], [40.4, 116.0], [40.5, 116.0], [40.6, 117.0], [40.7, 117.0], [40.8, 117.0], [40.9, 117.0], [41.0, 117.0], [41.1, 117.0], [41.2, 117.0], [41.3, 118.0], [41.4, 118.0], [41.5, 118.0], [41.6, 118.0], [41.7, 118.0], [41.8, 118.0], [41.9, 118.0], [42.0, 119.0], [42.1, 119.0], [42.2, 119.0], [42.3, 119.0], [42.4, 119.0], [42.5, 119.0], [42.6, 120.0], [42.7, 120.0], [42.8, 120.0], [42.9, 120.0], [43.0, 121.0], [43.1, 121.0], [43.2, 121.0], [43.3, 121.0], [43.4, 122.0], [43.5, 122.0], [43.6, 122.0], [43.7, 122.0], [43.8, 122.0], [43.9, 122.0], [44.0, 123.0], [44.1, 123.0], [44.2, 123.0], [44.3, 123.0], [44.4, 123.0], [44.5, 123.0], [44.6, 124.0], [44.7, 124.0], [44.8, 124.0], [44.9, 124.0], [45.0, 124.0], [45.1, 125.0], [45.2, 125.0], [45.3, 125.0], [45.4, 125.0], [45.5, 125.0], [45.6, 126.0], [45.7, 126.0], [45.8, 126.0], [45.9, 126.0], [46.0, 126.0], [46.1, 127.0], [46.2, 127.0], [46.3, 127.0], [46.4, 127.0], [46.5, 127.0], [46.6, 128.0], [46.7, 128.0], [46.8, 128.0], [46.9, 128.0], [47.0, 128.0], [47.1, 128.0], [47.2, 129.0], [47.3, 129.0], [47.4, 129.0], [47.5, 129.0], [47.6, 129.0], [47.7, 130.0], [47.8, 130.0], [47.9, 130.0], [48.0, 131.0], [48.1, 131.0], [48.2, 131.0], [48.3, 131.0], [48.4, 132.0], [48.5, 132.0], [48.6, 132.0], [48.7, 132.0], [48.8, 133.0], [48.9, 133.0], [49.0, 133.0], [49.1, 133.0], [49.2, 134.0], [49.3, 134.0], [49.4, 134.0], [49.5, 134.0], [49.6, 135.0], [49.7, 135.0], [49.8, 135.0], [49.9, 136.0], [50.0, 136.0], [50.1, 136.0], [50.2, 136.0], [50.3, 137.0], [50.4, 137.0], [50.5, 137.0], [50.6, 137.0], [50.7, 138.0], [50.8, 138.0], [50.9, 138.0], [51.0, 138.0], [51.1, 138.0], [51.2, 138.0], [51.3, 139.0], [51.4, 139.0], [51.5, 139.0], [51.6, 139.0], [51.7, 139.0], [51.8, 139.0], [51.9, 140.0], [52.0, 140.0], [52.1, 140.0], [52.2, 140.0], [52.3, 140.0], [52.4, 141.0], [52.5, 141.0], [52.6, 141.0], [52.7, 142.0], [52.8, 142.0], [52.9, 142.0], [53.0, 142.0], [53.1, 143.0], [53.2, 143.0], [53.3, 143.0], [53.4, 143.0], [53.5, 143.0], [53.6, 143.0], [53.7, 144.0], [53.8, 144.0], [53.9, 145.0], [54.0, 145.0], [54.1, 145.0], [54.2, 145.0], [54.3, 145.0], [54.4, 146.0], [54.5, 146.0], [54.6, 146.0], [54.7, 147.0], [54.8, 147.0], [54.9, 147.0], [55.0, 147.0], [55.1, 148.0], [55.2, 148.0], [55.3, 148.0], [55.4, 148.0], [55.5, 148.0], [55.6, 149.0], [55.7, 149.0], [55.8, 149.0], [55.9, 150.0], [56.0, 150.0], [56.1, 150.0], [56.2, 151.0], [56.3, 151.0], [56.4, 151.0], [56.5, 151.0], [56.6, 152.0], [56.7, 152.0], [56.8, 152.0], [56.9, 152.0], [57.0, 152.0], [57.1, 153.0], [57.2, 153.0], [57.3, 153.0], [57.4, 153.0], [57.5, 154.0], [57.6, 154.0], [57.7, 154.0], [57.8, 154.0], [57.9, 155.0], [58.0, 155.0], [58.1, 155.0], [58.2, 155.0], [58.3, 156.0], [58.4, 156.0], [58.5, 156.0], [58.6, 156.0], [58.7, 157.0], [58.8, 157.0], [58.9, 157.0], [59.0, 158.0], [59.1, 158.0], [59.2, 158.0], [59.3, 158.0], [59.4, 158.0], [59.5, 159.0], [59.6, 159.0], [59.7, 159.0], [59.8, 160.0], [59.9, 160.0], [60.0, 160.0], [60.1, 160.0], [60.2, 161.0], [60.3, 161.0], [60.4, 161.0], [60.5, 161.0], [60.6, 162.0], [60.7, 162.0], [60.8, 162.0], [60.9, 163.0], [61.0, 163.0], [61.1, 163.0], [61.2, 163.0], [61.3, 164.0], [61.4, 164.0], [61.5, 164.0], [61.6, 165.0], [61.7, 165.0], [61.8, 165.0], [61.9, 165.0], [62.0, 166.0], [62.1, 166.0], [62.2, 166.0], [62.3, 166.0], [62.4, 167.0], [62.5, 167.0], [62.6, 168.0], [62.7, 168.0], [62.8, 169.0], [62.9, 169.0], [63.0, 169.0], [63.1, 169.0], [63.2, 170.0], [63.3, 170.0], [63.4, 170.0], [63.5, 170.0], [63.6, 171.0], [63.7, 171.0], [63.8, 171.0], [63.9, 171.0], [64.0, 172.0], [64.1, 173.0], [64.2, 173.0], [64.3, 173.0], [64.4, 173.0], [64.5, 174.0], [64.6, 174.0], [64.7, 174.0], [64.8, 174.0], [64.9, 175.0], [65.0, 175.0], [65.1, 176.0], [65.2, 176.0], [65.3, 176.0], [65.4, 177.0], [65.5, 177.0], [65.6, 178.0], [65.7, 178.0], [65.8, 179.0], [65.9, 179.0], [66.0, 179.0], [66.1, 179.0], [66.2, 180.0], [66.3, 180.0], [66.4, 180.0], [66.5, 181.0], [66.6, 181.0], [66.7, 181.0], [66.8, 182.0], [66.9, 182.0], [67.0, 183.0], [67.1, 183.0], [67.2, 183.0], [67.3, 183.0], [67.4, 184.0], [67.5, 184.0], [67.6, 185.0], [67.7, 185.0], [67.8, 185.0], [67.9, 185.0], [68.0, 186.0], [68.1, 186.0], [68.2, 186.0], [68.3, 187.0], [68.4, 187.0], [68.5, 188.0], [68.6, 188.0], [68.7, 188.0], [68.8, 188.0], [68.9, 189.0], [69.0, 190.0], [69.1, 190.0], [69.2, 190.0], [69.3, 190.0], [69.4, 191.0], [69.5, 191.0], [69.6, 191.0], [69.7, 192.0], [69.8, 192.0], [69.9, 193.0], [70.0, 193.0], [70.1, 194.0], [70.2, 194.0], [70.3, 195.0], [70.4, 195.0], [70.5, 195.0], [70.6, 196.0], [70.7, 196.0], [70.8, 196.0], [70.9, 197.0], [71.0, 197.0], [71.1, 198.0], [71.2, 198.0], [71.3, 198.0], [71.4, 199.0], [71.5, 199.0], [71.6, 199.0], [71.7, 200.0], [71.8, 200.0], [71.9, 200.0], [72.0, 201.0], [72.1, 201.0], [72.2, 202.0], [72.3, 203.0], [72.4, 203.0], [72.5, 204.0], [72.6, 204.0], [72.7, 204.0], [72.8, 205.0], [72.9, 205.0], [73.0, 205.0], [73.1, 206.0], [73.2, 207.0], [73.3, 207.0], [73.4, 207.0], [73.5, 208.0], [73.6, 208.0], [73.7, 209.0], [73.8, 209.0], [73.9, 210.0], [74.0, 210.0], [74.1, 211.0], [74.2, 211.0], [74.3, 211.0], [74.4, 212.0], [74.5, 212.0], [74.6, 212.0], [74.7, 213.0], [74.8, 213.0], [74.9, 214.0], [75.0, 215.0], [75.1, 215.0], [75.2, 215.0], [75.3, 216.0], [75.4, 216.0], [75.5, 216.0], [75.6, 217.0], [75.7, 217.0], [75.8, 218.0], [75.9, 218.0], [76.0, 218.0], [76.1, 219.0], [76.2, 219.0], [76.3, 219.0], [76.4, 220.0], [76.5, 220.0], [76.6, 221.0], [76.7, 221.0], [76.8, 222.0], [76.9, 223.0], [77.0, 223.0], [77.1, 224.0], [77.2, 224.0], [77.3, 225.0], [77.4, 225.0], [77.5, 225.0], [77.6, 226.0], [77.7, 227.0], [77.8, 227.0], [77.9, 228.0], [78.0, 228.0], [78.1, 228.0], [78.2, 229.0], [78.3, 229.0], [78.4, 230.0], [78.5, 230.0], [78.6, 231.0], [78.7, 232.0], [78.8, 232.0], [78.9, 233.0], [79.0, 233.0], [79.1, 234.0], [79.2, 234.0], [79.3, 235.0], [79.4, 235.0], [79.5, 236.0], [79.6, 236.0], [79.7, 237.0], [79.8, 238.0], [79.9, 238.0], [80.0, 240.0], [80.1, 240.0], [80.2, 241.0], [80.3, 242.0], [80.4, 242.0], [80.5, 243.0], [80.6, 243.0], [80.7, 244.0], [80.8, 246.0], [80.9, 246.0], [81.0, 246.0], [81.1, 248.0], [81.2, 248.0], [81.3, 249.0], [81.4, 249.0], [81.5, 250.0], [81.6, 250.0], [81.7, 250.0], [81.8, 251.0], [81.9, 251.0], [82.0, 252.0], [82.1, 253.0], [82.2, 253.0], [82.3, 254.0], [82.4, 254.0], [82.5, 255.0], [82.6, 255.0], [82.7, 257.0], [82.8, 257.0], [82.9, 258.0], [83.0, 259.0], [83.1, 259.0], [83.2, 259.0], [83.3, 261.0], [83.4, 261.0], [83.5, 262.0], [83.6, 263.0], [83.7, 264.0], [83.8, 264.0], [83.9, 266.0], [84.0, 266.0], [84.1, 267.0], [84.2, 268.0], [84.3, 269.0], [84.4, 269.0], [84.5, 270.0], [84.6, 271.0], [84.7, 271.0], [84.8, 272.0], [84.9, 273.0], [85.0, 273.0], [85.1, 274.0], [85.2, 274.0], [85.3, 275.0], [85.4, 276.0], [85.5, 276.0], [85.6, 277.0], [85.7, 278.0], [85.8, 279.0], [85.9, 279.0], [86.0, 280.0], [86.1, 281.0], [86.2, 282.0], [86.3, 282.0], [86.4, 283.0], [86.5, 283.0], [86.6, 284.0], [86.7, 285.0], [86.8, 286.0], [86.9, 288.0], [87.0, 289.0], [87.1, 290.0], [87.2, 291.0], [87.3, 291.0], [87.4, 292.0], [87.5, 293.0], [87.6, 294.0], [87.7, 295.0], [87.8, 296.0], [87.9, 297.0], [88.0, 298.0], [88.1, 298.0], [88.2, 299.0], [88.3, 300.0], [88.4, 301.0], [88.5, 301.0], [88.6, 302.0], [88.7, 303.0], [88.8, 304.0], [88.9, 304.0], [89.0, 305.0], [89.1, 307.0], [89.2, 308.0], [89.3, 308.0], [89.4, 310.0], [89.5, 311.0], [89.6, 313.0], [89.7, 313.0], [89.8, 315.0], [89.9, 316.0], [90.0, 316.0], [90.1, 317.0], [90.2, 318.0], [90.3, 319.0], [90.4, 321.0], [90.5, 321.0], [90.6, 323.0], [90.7, 325.0], [90.8, 326.0], [90.9, 328.0], [91.0, 328.0], [91.1, 329.0], [91.2, 330.0], [91.3, 332.0], [91.4, 332.0], [91.5, 334.0], [91.6, 336.0], [91.7, 337.0], [91.8, 339.0], [91.9, 341.0], [92.0, 343.0], [92.1, 345.0], [92.2, 347.0], [92.3, 348.0], [92.4, 349.0], [92.5, 350.0], [92.6, 353.0], [92.7, 355.0], [92.8, 356.0], [92.9, 357.0], [93.0, 359.0], [93.1, 362.0], [93.2, 362.0], [93.3, 364.0], [93.4, 366.0], [93.5, 367.0], [93.6, 369.0], [93.7, 371.0], [93.8, 372.0], [93.9, 376.0], [94.0, 377.0], [94.1, 378.0], [94.2, 379.0], [94.3, 380.0], [94.4, 383.0], [94.5, 384.0], [94.6, 386.0], [94.7, 389.0], [94.8, 392.0], [94.9, 395.0], [95.0, 399.0], [95.1, 402.0], [95.2, 405.0], [95.3, 407.0], [95.4, 411.0], [95.5, 414.0], [95.6, 416.0], [95.7, 418.0], [95.8, 419.0], [95.9, 421.0], [96.0, 423.0], [96.1, 427.0], [96.2, 433.0], [96.3, 435.0], [96.4, 438.0], [96.5, 441.0], [96.6, 443.0], [96.7, 451.0], [96.8, 456.0], [96.9, 459.0], [97.0, 462.0], [97.1, 469.0], [97.2, 472.0], [97.3, 476.0], [97.4, 484.0], [97.5, 489.0], [97.6, 494.0], [97.7, 505.0], [97.8, 511.0], [97.9, 517.0], [98.0, 528.0], [98.1, 532.0], [98.2, 546.0], [98.3, 553.0], [98.4, 561.0], [98.5, 573.0], [98.6, 584.0], [98.7, 607.0], [98.8, 632.0], [98.9, 642.0], [99.0, 651.0], [99.1, 678.0], [99.2, 713.0], [99.3, 725.0], [99.4, 781.0], [99.5, 924.0], [99.6, 1067.0], [99.7, 1184.0], [99.8, 1276.0], [99.9, 1516.0], [100.0, 1902.0]], "isOverall": false, "label": "GET /api/products (hot read path)", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 1755.0, "series": [{"data": [[0.0, 1389.0], [600.0, 22.0], [700.0, 12.0], [200.0, 728.0], [800.0, 4.0], [900.0, 3.0], [1000.0, 2.0], [1100.0, 5.0], [300.0, 298.0], [1200.0, 5.0], [1300.0, 2.0], [1500.0, 2.0], [100.0, 1755.0], [400.0, 116.0], [1700.0, 2.0], [1900.0, 1.0], [500.0, 42.0]], "isOverall": false, "label": "GET /api/products (hot read path)", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 1900.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 5.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 4287.0, "series": [{"data": [[0.0, 4287.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 96.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 5.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 18.280239520958077, "minX": 1.78169928E12, "maxY": 20.0, "series": [{"data": [[1.7816994E12, 19.845659163987133], [1.78169928E12, 18.280239520958077], [1.78169934E12, 20.0]], "isOverall": false, "label": "100 Concurrent Users", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7816994E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 75.625, "minX": 1.0, "maxY": 247.11111111111111, "series": [{"data": [[2.0, 125.33333333333334], [8.0, 75.66666666666667], [9.0, 114.90000000000002], [10.0, 113.45454545454545], [11.0, 96.73333333333333], [3.0, 91.25], [12.0, 84.59999999999998], [13.0, 123.9375], [14.0, 129.13333333333333], [15.0, 115.08333333333333], [4.0, 79.66666666666667], [16.0, 127.56521739130436], [1.0, 184.0], [17.0, 114.60000000000001], [18.0, 142.58823529411762], [19.0, 247.11111111111111], [5.0, 75.625], [20.0, 176.0167785234899], [6.0, 77.5], [7.0, 115.0]], "isOverall": false, "label": "GET /api/products (hot read path)", "isController": false}, {"data": [[19.62898814949867, 173.35938924339086]], "isOverall": false, "label": "GET /api/products (hot read path)-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 20.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 2143.1666666666665, "minX": 1.78169928E12, "maxY": 7.073325516666667E7, "series": [{"data": [[1.7816994E12, 3.8108462333333336E7], [1.78169928E12, 2.55789124E7], [1.78169934E12, 7.073325516666667E7]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.7816994E12, 3192.9333333333334], [1.78169928E12, 2143.1666666666665], [1.78169934E12, 5926.433333333333]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7816994E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 162.7988023952095, "minX": 1.78169928E12, "maxY": 189.0940514469454, "series": [{"data": [[1.7816994E12, 189.0940514469454], [1.78169928E12, 162.7988023952095], [1.78169934E12, 168.70116933737566]], "isOverall": false, "label": "GET /api/products (hot read path)", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7816994E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 125.61916167664666, "minX": 1.78169928E12, "maxY": 146.37861736334386, "series": [{"data": [[1.7816994E12, 146.37861736334386], [1.78169928E12, 125.61916167664666], [1.78169934E12, 129.86964053702852]], "isOverall": false, "label": "GET /api/products (hot read path)", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7816994E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 0.0, "minX": 1.78169928E12, "maxY": 0.07425149700598797, "series": [{"data": [[1.7816994E12, 0.0], [1.78169928E12, 0.07425149700598797], [1.78169934E12, 0.004330879168471198]], "isOverall": false, "label": "GET /api/products (hot read path)", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7816994E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 32.0, "minX": 1.78169928E12, "maxY": 1902.0, "series": [{"data": [[1.7816994E12, 1902.0], [1.78169928E12, 705.0], [1.78169934E12, 981.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.7816994E12, 347.0], [1.78169928E12, 313.0], [1.78169934E12, 307.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.7816994E12, 1205.9999999999982], [1.78169928E12, 469.64], [1.78169934E12, 567.8000000000002]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.7816994E12, 485.0], [1.78169928E12, 379.0], [1.78169934E12, 381.5]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.7816994E12, 32.0], [1.78169928E12, 34.0], [1.78169934E12, 33.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.7816994E12, 134.5], [1.78169928E12, 132.0], [1.78169934E12, 137.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7816994E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 59.0, "minX": 7.0, "maxY": 476.0, "series": [{"data": [[33.0, 207.0], [32.0, 249.5], [34.0, 169.5], [35.0, 158.0], [36.0, 187.0], [37.0, 163.0], [38.0, 150.5], [39.0, 145.0], [41.0, 117.0], [40.0, 116.0], [42.0, 108.5], [43.0, 128.5], [44.0, 108.0], [45.0, 98.0], [46.0, 101.0], [48.0, 101.0], [49.0, 75.0], [7.0, 59.0], [11.0, 59.0], [14.0, 422.0], [15.0, 72.0], [18.0, 219.0], [21.0, 79.0], [23.0, 476.0], [25.0, 126.5], [26.0, 159.5], [27.0, 356.5], [28.0, 139.0], [29.0, 203.0], [30.0, 140.0], [31.0, 175.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 49.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 44.0, "minX": 7.0, "maxY": 358.0, "series": [{"data": [[33.0, 157.0], [32.0, 176.5], [34.0, 126.0], [35.0, 111.5], [36.0, 145.0], [37.0, 127.0], [38.0, 119.0], [39.0, 110.5], [41.0, 90.0], [40.0, 85.0], [42.0, 84.0], [43.0, 99.5], [44.0, 80.0], [45.0, 72.0], [46.0, 73.5], [48.0, 76.0], [49.0, 55.0], [7.0, 44.0], [11.0, 44.0], [14.0, 358.0], [15.0, 48.0], [18.0, 192.0], [21.0, 56.0], [23.0, 337.0], [25.0, 104.5], [26.0, 114.5], [27.0, 236.5], [28.0, 113.5], [29.0, 146.0], [30.0, 103.5], [31.0, 126.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 49.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 14.016666666666667, "minX": 1.78169928E12, "maxY": 38.416666666666664, "series": [{"data": [[1.7816994E12, 20.7], [1.78169928E12, 14.016666666666667], [1.78169934E12, 38.416666666666664]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7816994E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 13.916666666666666, "minX": 1.78169928E12, "maxY": 38.483333333333334, "series": [{"data": [[1.7816994E12, 20.733333333333334], [1.78169928E12, 13.916666666666666], [1.78169934E12, 38.483333333333334]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7816994E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 13.916666666666666, "minX": 1.78169928E12, "maxY": 38.483333333333334, "series": [{"data": [[1.7816994E12, 20.733333333333334], [1.78169928E12, 13.916666666666666], [1.78169934E12, 38.483333333333334]], "isOverall": false, "label": "GET /api/products (hot read path)-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7816994E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 13.916666666666666, "minX": 1.78169928E12, "maxY": 38.483333333333334, "series": [{"data": [[1.7816994E12, 20.733333333333334], [1.78169928E12, 13.916666666666666], [1.78169934E12, 38.483333333333334]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7816994E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 0);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

