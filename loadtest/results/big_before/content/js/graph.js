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
        data: {"result": {"minY": 42.0, "minX": 0.0, "maxY": 8794.0, "series": [{"data": [[0.0, 42.0], [0.1, 49.0], [0.2, 50.0], [0.3, 51.0], [0.4, 52.0], [0.5, 53.0], [0.6, 53.0], [0.7, 55.0], [0.8, 56.0], [0.9, 56.0], [1.0, 57.0], [1.1, 57.0], [1.2, 58.0], [1.3, 58.0], [1.4, 59.0], [1.5, 59.0], [1.6, 59.0], [1.7, 60.0], [1.8, 60.0], [1.9, 61.0], [2.0, 62.0], [2.1, 62.0], [2.2, 62.0], [2.3, 63.0], [2.4, 63.0], [2.5, 63.0], [2.6, 63.0], [2.7, 64.0], [2.8, 64.0], [2.9, 64.0], [3.0, 64.0], [3.1, 65.0], [3.2, 65.0], [3.3, 65.0], [3.4, 65.0], [3.5, 66.0], [3.6, 66.0], [3.7, 67.0], [3.8, 67.0], [3.9, 67.0], [4.0, 67.0], [4.1, 67.0], [4.2, 67.0], [4.3, 68.0], [4.4, 68.0], [4.5, 69.0], [4.6, 69.0], [4.7, 69.0], [4.8, 70.0], [4.9, 70.0], [5.0, 70.0], [5.1, 70.0], [5.2, 70.0], [5.3, 70.0], [5.4, 70.0], [5.5, 71.0], [5.6, 71.0], [5.7, 71.0], [5.8, 71.0], [5.9, 71.0], [6.0, 72.0], [6.1, 72.0], [6.2, 72.0], [6.3, 72.0], [6.4, 73.0], [6.5, 73.0], [6.6, 73.0], [6.7, 73.0], [6.8, 73.0], [6.9, 73.0], [7.0, 73.0], [7.1, 73.0], [7.2, 74.0], [7.3, 74.0], [7.4, 74.0], [7.5, 74.0], [7.6, 75.0], [7.7, 75.0], [7.8, 75.0], [7.9, 75.0], [8.0, 76.0], [8.1, 76.0], [8.2, 76.0], [8.3, 76.0], [8.4, 76.0], [8.5, 76.0], [8.6, 76.0], [8.7, 76.0], [8.8, 77.0], [8.9, 77.0], [9.0, 77.0], [9.1, 77.0], [9.2, 78.0], [9.3, 78.0], [9.4, 78.0], [9.5, 78.0], [9.6, 78.0], [9.7, 78.0], [9.8, 79.0], [9.9, 79.0], [10.0, 79.0], [10.1, 79.0], [10.2, 79.0], [10.3, 79.0], [10.4, 79.0], [10.5, 80.0], [10.6, 80.0], [10.7, 80.0], [10.8, 80.0], [10.9, 80.0], [11.0, 80.0], [11.1, 80.0], [11.2, 81.0], [11.3, 81.0], [11.4, 81.0], [11.5, 81.0], [11.6, 81.0], [11.7, 81.0], [11.8, 81.0], [11.9, 82.0], [12.0, 82.0], [12.1, 82.0], [12.2, 82.0], [12.3, 82.0], [12.4, 82.0], [12.5, 82.0], [12.6, 82.0], [12.7, 83.0], [12.8, 83.0], [12.9, 83.0], [13.0, 83.0], [13.1, 83.0], [13.2, 83.0], [13.3, 84.0], [13.4, 84.0], [13.5, 84.0], [13.6, 84.0], [13.7, 84.0], [13.8, 84.0], [13.9, 84.0], [14.0, 84.0], [14.1, 85.0], [14.2, 85.0], [14.3, 85.0], [14.4, 85.0], [14.5, 85.0], [14.6, 85.0], [14.7, 85.0], [14.8, 86.0], [14.9, 86.0], [15.0, 86.0], [15.1, 86.0], [15.2, 86.0], [15.3, 86.0], [15.4, 87.0], [15.5, 87.0], [15.6, 87.0], [15.7, 87.0], [15.8, 87.0], [15.9, 88.0], [16.0, 88.0], [16.1, 88.0], [16.2, 88.0], [16.3, 88.0], [16.4, 88.0], [16.5, 88.0], [16.6, 88.0], [16.7, 89.0], [16.8, 89.0], [16.9, 89.0], [17.0, 89.0], [17.1, 89.0], [17.2, 89.0], [17.3, 89.0], [17.4, 90.0], [17.5, 90.0], [17.6, 90.0], [17.7, 90.0], [17.8, 90.0], [17.9, 90.0], [18.0, 90.0], [18.1, 91.0], [18.2, 91.0], [18.3, 91.0], [18.4, 91.0], [18.5, 91.0], [18.6, 91.0], [18.7, 92.0], [18.8, 92.0], [18.9, 92.0], [19.0, 92.0], [19.1, 92.0], [19.2, 92.0], [19.3, 92.0], [19.4, 93.0], [19.5, 93.0], [19.6, 93.0], [19.7, 93.0], [19.8, 93.0], [19.9, 93.0], [20.0, 93.0], [20.1, 94.0], [20.2, 94.0], [20.3, 94.0], [20.4, 94.0], [20.5, 94.0], [20.6, 94.0], [20.7, 94.0], [20.8, 95.0], [20.9, 95.0], [21.0, 95.0], [21.1, 95.0], [21.2, 95.0], [21.3, 95.0], [21.4, 96.0], [21.5, 96.0], [21.6, 96.0], [21.7, 96.0], [21.8, 96.0], [21.9, 96.0], [22.0, 96.0], [22.1, 96.0], [22.2, 97.0], [22.3, 97.0], [22.4, 97.0], [22.5, 97.0], [22.6, 97.0], [22.7, 97.0], [22.8, 98.0], [22.9, 98.0], [23.0, 98.0], [23.1, 98.0], [23.2, 98.0], [23.3, 99.0], [23.4, 99.0], [23.5, 99.0], [23.6, 99.0], [23.7, 99.0], [23.8, 99.0], [23.9, 99.0], [24.0, 99.0], [24.1, 100.0], [24.2, 100.0], [24.3, 100.0], [24.4, 100.0], [24.5, 100.0], [24.6, 100.0], [24.7, 101.0], [24.8, 101.0], [24.9, 101.0], [25.0, 101.0], [25.1, 101.0], [25.2, 101.0], [25.3, 102.0], [25.4, 102.0], [25.5, 102.0], [25.6, 102.0], [25.7, 102.0], [25.8, 102.0], [25.9, 102.0], [26.0, 102.0], [26.1, 103.0], [26.2, 103.0], [26.3, 103.0], [26.4, 103.0], [26.5, 103.0], [26.6, 103.0], [26.7, 104.0], [26.8, 104.0], [26.9, 104.0], [27.0, 104.0], [27.1, 104.0], [27.2, 104.0], [27.3, 105.0], [27.4, 105.0], [27.5, 105.0], [27.6, 105.0], [27.7, 105.0], [27.8, 106.0], [27.9, 106.0], [28.0, 106.0], [28.1, 106.0], [28.2, 106.0], [28.3, 106.0], [28.4, 106.0], [28.5, 106.0], [28.6, 107.0], [28.7, 107.0], [28.8, 107.0], [28.9, 107.0], [29.0, 107.0], [29.1, 107.0], [29.2, 108.0], [29.3, 108.0], [29.4, 108.0], [29.5, 108.0], [29.6, 108.0], [29.7, 108.0], [29.8, 109.0], [29.9, 109.0], [30.0, 109.0], [30.1, 109.0], [30.2, 109.0], [30.3, 109.0], [30.4, 110.0], [30.5, 110.0], [30.6, 110.0], [30.7, 110.0], [30.8, 110.0], [30.9, 110.0], [31.0, 110.0], [31.1, 111.0], [31.2, 111.0], [31.3, 111.0], [31.4, 111.0], [31.5, 111.0], [31.6, 112.0], [31.7, 112.0], [31.8, 112.0], [31.9, 112.0], [32.0, 112.0], [32.1, 112.0], [32.2, 112.0], [32.3, 113.0], [32.4, 113.0], [32.5, 113.0], [32.6, 113.0], [32.7, 113.0], [32.8, 114.0], [32.9, 114.0], [33.0, 114.0], [33.1, 114.0], [33.2, 114.0], [33.3, 114.0], [33.4, 115.0], [33.5, 115.0], [33.6, 115.0], [33.7, 115.0], [33.8, 115.0], [33.9, 115.0], [34.0, 115.0], [34.1, 116.0], [34.2, 116.0], [34.3, 116.0], [34.4, 116.0], [34.5, 116.0], [34.6, 116.0], [34.7, 117.0], [34.8, 117.0], [34.9, 117.0], [35.0, 118.0], [35.1, 118.0], [35.2, 118.0], [35.3, 118.0], [35.4, 118.0], [35.5, 119.0], [35.6, 119.0], [35.7, 119.0], [35.8, 119.0], [35.9, 120.0], [36.0, 120.0], [36.1, 120.0], [36.2, 120.0], [36.3, 120.0], [36.4, 120.0], [36.5, 120.0], [36.6, 121.0], [36.7, 121.0], [36.8, 121.0], [36.9, 121.0], [37.0, 121.0], [37.1, 122.0], [37.2, 122.0], [37.3, 122.0], [37.4, 122.0], [37.5, 122.0], [37.6, 123.0], [37.7, 123.0], [37.8, 123.0], [37.9, 124.0], [38.0, 124.0], [38.1, 124.0], [38.2, 124.0], [38.3, 124.0], [38.4, 124.0], [38.5, 125.0], [38.6, 125.0], [38.7, 125.0], [38.8, 125.0], [38.9, 125.0], [39.0, 126.0], [39.1, 126.0], [39.2, 126.0], [39.3, 126.0], [39.4, 126.0], [39.5, 126.0], [39.6, 127.0], [39.7, 127.0], [39.8, 127.0], [39.9, 127.0], [40.0, 127.0], [40.1, 127.0], [40.2, 128.0], [40.3, 128.0], [40.4, 128.0], [40.5, 128.0], [40.6, 128.0], [40.7, 128.0], [40.8, 128.0], [40.9, 128.0], [41.0, 129.0], [41.1, 129.0], [41.2, 129.0], [41.3, 129.0], [41.4, 129.0], [41.5, 129.0], [41.6, 130.0], [41.7, 130.0], [41.8, 130.0], [41.9, 130.0], [42.0, 130.0], [42.1, 130.0], [42.2, 130.0], [42.3, 131.0], [42.4, 131.0], [42.5, 131.0], [42.6, 131.0], [42.7, 131.0], [42.8, 132.0], [42.9, 132.0], [43.0, 132.0], [43.1, 132.0], [43.2, 132.0], [43.3, 132.0], [43.4, 133.0], [43.5, 133.0], [43.6, 133.0], [43.7, 133.0], [43.8, 134.0], [43.9, 134.0], [44.0, 134.0], [44.1, 134.0], [44.2, 134.0], [44.3, 135.0], [44.4, 135.0], [44.5, 136.0], [44.6, 136.0], [44.7, 136.0], [44.8, 136.0], [44.9, 136.0], [45.0, 136.0], [45.1, 137.0], [45.2, 137.0], [45.3, 137.0], [45.4, 137.0], [45.5, 137.0], [45.6, 137.0], [45.7, 137.0], [45.8, 138.0], [45.9, 138.0], [46.0, 138.0], [46.1, 138.0], [46.2, 139.0], [46.3, 139.0], [46.4, 139.0], [46.5, 139.0], [46.6, 139.0], [46.7, 139.0], [46.8, 140.0], [46.9, 140.0], [47.0, 140.0], [47.1, 140.0], [47.2, 140.0], [47.3, 140.0], [47.4, 141.0], [47.5, 141.0], [47.6, 141.0], [47.7, 141.0], [47.8, 141.0], [47.9, 142.0], [48.0, 142.0], [48.1, 142.0], [48.2, 142.0], [48.3, 143.0], [48.4, 143.0], [48.5, 143.0], [48.6, 143.0], [48.7, 144.0], [48.8, 144.0], [48.9, 145.0], [49.0, 145.0], [49.1, 145.0], [49.2, 145.0], [49.3, 145.0], [49.4, 146.0], [49.5, 146.0], [49.6, 146.0], [49.7, 146.0], [49.8, 146.0], [49.9, 147.0], [50.0, 147.0], [50.1, 147.0], [50.2, 147.0], [50.3, 147.0], [50.4, 148.0], [50.5, 148.0], [50.6, 148.0], [50.7, 148.0], [50.8, 149.0], [50.9, 149.0], [51.0, 149.0], [51.1, 149.0], [51.2, 150.0], [51.3, 150.0], [51.4, 150.0], [51.5, 150.0], [51.6, 150.0], [51.7, 151.0], [51.8, 151.0], [51.9, 151.0], [52.0, 152.0], [52.1, 152.0], [52.2, 152.0], [52.3, 152.0], [52.4, 152.0], [52.5, 153.0], [52.6, 153.0], [52.7, 153.0], [52.8, 153.0], [52.9, 154.0], [53.0, 154.0], [53.1, 154.0], [53.2, 154.0], [53.3, 154.0], [53.4, 155.0], [53.5, 155.0], [53.6, 155.0], [53.7, 155.0], [53.8, 155.0], [53.9, 156.0], [54.0, 156.0], [54.1, 156.0], [54.2, 157.0], [54.3, 157.0], [54.4, 157.0], [54.5, 157.0], [54.6, 157.0], [54.7, 158.0], [54.8, 158.0], [54.9, 158.0], [55.0, 158.0], [55.1, 159.0], [55.2, 159.0], [55.3, 159.0], [55.4, 160.0], [55.5, 160.0], [55.6, 161.0], [55.7, 161.0], [55.8, 162.0], [55.9, 162.0], [56.0, 162.0], [56.1, 162.0], [56.2, 162.0], [56.3, 162.0], [56.4, 163.0], [56.5, 163.0], [56.6, 164.0], [56.7, 164.0], [56.8, 164.0], [56.9, 165.0], [57.0, 165.0], [57.1, 165.0], [57.2, 165.0], [57.3, 166.0], [57.4, 166.0], [57.5, 166.0], [57.6, 166.0], [57.7, 167.0], [57.8, 167.0], [57.9, 167.0], [58.0, 167.0], [58.1, 168.0], [58.2, 168.0], [58.3, 168.0], [58.4, 168.0], [58.5, 169.0], [58.6, 169.0], [58.7, 169.0], [58.8, 170.0], [58.9, 170.0], [59.0, 171.0], [59.1, 171.0], [59.2, 171.0], [59.3, 172.0], [59.4, 172.0], [59.5, 172.0], [59.6, 172.0], [59.7, 173.0], [59.8, 173.0], [59.9, 174.0], [60.0, 175.0], [60.1, 175.0], [60.2, 176.0], [60.3, 176.0], [60.4, 176.0], [60.5, 177.0], [60.6, 177.0], [60.7, 177.0], [60.8, 178.0], [60.9, 178.0], [61.0, 178.0], [61.1, 179.0], [61.2, 179.0], [61.3, 179.0], [61.4, 180.0], [61.5, 180.0], [61.6, 180.0], [61.7, 181.0], [61.8, 181.0], [61.9, 182.0], [62.0, 182.0], [62.1, 183.0], [62.2, 183.0], [62.3, 184.0], [62.4, 184.0], [62.5, 184.0], [62.6, 185.0], [62.7, 185.0], [62.8, 186.0], [62.9, 186.0], [63.0, 187.0], [63.1, 187.0], [63.2, 187.0], [63.3, 187.0], [63.4, 187.0], [63.5, 188.0], [63.6, 188.0], [63.7, 188.0], [63.8, 189.0], [63.9, 189.0], [64.0, 189.0], [64.1, 190.0], [64.2, 190.0], [64.3, 191.0], [64.4, 191.0], [64.5, 192.0], [64.6, 192.0], [64.7, 192.0], [64.8, 193.0], [64.9, 193.0], [65.0, 194.0], [65.1, 194.0], [65.2, 194.0], [65.3, 195.0], [65.4, 195.0], [65.5, 196.0], [65.6, 196.0], [65.7, 197.0], [65.8, 197.0], [65.9, 198.0], [66.0, 199.0], [66.1, 199.0], [66.2, 200.0], [66.3, 201.0], [66.4, 201.0], [66.5, 201.0], [66.6, 202.0], [66.7, 202.0], [66.8, 202.0], [66.9, 202.0], [67.0, 203.0], [67.1, 203.0], [67.2, 203.0], [67.3, 204.0], [67.4, 204.0], [67.5, 205.0], [67.6, 205.0], [67.7, 206.0], [67.8, 207.0], [67.9, 207.0], [68.0, 208.0], [68.1, 208.0], [68.2, 209.0], [68.3, 209.0], [68.4, 210.0], [68.5, 210.0], [68.6, 211.0], [68.7, 211.0], [68.8, 211.0], [68.9, 211.0], [69.0, 212.0], [69.1, 212.0], [69.2, 212.0], [69.3, 213.0], [69.4, 213.0], [69.5, 213.0], [69.6, 214.0], [69.7, 214.0], [69.8, 215.0], [69.9, 215.0], [70.0, 215.0], [70.1, 216.0], [70.2, 216.0], [70.3, 216.0], [70.4, 217.0], [70.5, 217.0], [70.6, 217.0], [70.7, 218.0], [70.8, 218.0], [70.9, 219.0], [71.0, 219.0], [71.1, 220.0], [71.2, 221.0], [71.3, 222.0], [71.4, 222.0], [71.5, 223.0], [71.6, 223.0], [71.7, 223.0], [71.8, 224.0], [71.9, 224.0], [72.0, 225.0], [72.1, 225.0], [72.2, 226.0], [72.3, 226.0], [72.4, 227.0], [72.5, 227.0], [72.6, 228.0], [72.7, 228.0], [72.8, 229.0], [72.9, 230.0], [73.0, 230.0], [73.1, 231.0], [73.2, 231.0], [73.3, 232.0], [73.4, 233.0], [73.5, 233.0], [73.6, 234.0], [73.7, 234.0], [73.8, 236.0], [73.9, 237.0], [74.0, 237.0], [74.1, 237.0], [74.2, 237.0], [74.3, 238.0], [74.4, 238.0], [74.5, 238.0], [74.6, 239.0], [74.7, 240.0], [74.8, 241.0], [74.9, 242.0], [75.0, 242.0], [75.1, 243.0], [75.2, 244.0], [75.3, 244.0], [75.4, 245.0], [75.5, 246.0], [75.6, 246.0], [75.7, 247.0], [75.8, 248.0], [75.9, 249.0], [76.0, 250.0], [76.1, 250.0], [76.2, 251.0], [76.3, 252.0], [76.4, 252.0], [76.5, 252.0], [76.6, 253.0], [76.7, 253.0], [76.8, 253.0], [76.9, 254.0], [77.0, 255.0], [77.1, 256.0], [77.2, 256.0], [77.3, 257.0], [77.4, 259.0], [77.5, 259.0], [77.6, 260.0], [77.7, 261.0], [77.8, 262.0], [77.9, 262.0], [78.0, 262.0], [78.1, 262.0], [78.2, 263.0], [78.3, 263.0], [78.4, 264.0], [78.5, 265.0], [78.6, 266.0], [78.7, 266.0], [78.8, 267.0], [78.9, 268.0], [79.0, 269.0], [79.1, 269.0], [79.2, 270.0], [79.3, 271.0], [79.4, 272.0], [79.5, 273.0], [79.6, 274.0], [79.7, 274.0], [79.8, 275.0], [79.9, 275.0], [80.0, 276.0], [80.1, 277.0], [80.2, 277.0], [80.3, 278.0], [80.4, 279.0], [80.5, 280.0], [80.6, 281.0], [80.7, 283.0], [80.8, 284.0], [80.9, 285.0], [81.0, 287.0], [81.1, 287.0], [81.2, 288.0], [81.3, 290.0], [81.4, 290.0], [81.5, 291.0], [81.6, 291.0], [81.7, 292.0], [81.8, 293.0], [81.9, 295.0], [82.0, 296.0], [82.1, 296.0], [82.2, 297.0], [82.3, 297.0], [82.4, 298.0], [82.5, 298.0], [82.6, 299.0], [82.7, 300.0], [82.8, 301.0], [82.9, 302.0], [83.0, 303.0], [83.1, 304.0], [83.2, 305.0], [83.3, 307.0], [83.4, 308.0], [83.5, 308.0], [83.6, 310.0], [83.7, 311.0], [83.8, 311.0], [83.9, 314.0], [84.0, 315.0], [84.1, 315.0], [84.2, 318.0], [84.3, 319.0], [84.4, 320.0], [84.5, 322.0], [84.6, 323.0], [84.7, 323.0], [84.8, 324.0], [84.9, 325.0], [85.0, 328.0], [85.1, 328.0], [85.2, 329.0], [85.3, 329.0], [85.4, 330.0], [85.5, 331.0], [85.6, 332.0], [85.7, 332.0], [85.8, 334.0], [85.9, 336.0], [86.0, 336.0], [86.1, 337.0], [86.2, 338.0], [86.3, 339.0], [86.4, 340.0], [86.5, 342.0], [86.6, 343.0], [86.7, 344.0], [86.8, 345.0], [86.9, 347.0], [87.0, 348.0], [87.1, 352.0], [87.2, 353.0], [87.3, 357.0], [87.4, 359.0], [87.5, 360.0], [87.6, 363.0], [87.7, 365.0], [87.8, 367.0], [87.9, 372.0], [88.0, 373.0], [88.1, 377.0], [88.2, 378.0], [88.3, 380.0], [88.4, 380.0], [88.5, 382.0], [88.6, 383.0], [88.7, 386.0], [88.8, 389.0], [88.9, 392.0], [89.0, 395.0], [89.1, 398.0], [89.2, 399.0], [89.3, 401.0], [89.4, 403.0], [89.5, 407.0], [89.6, 413.0], [89.7, 416.0], [89.8, 421.0], [89.9, 424.0], [90.0, 426.0], [90.1, 428.0], [90.2, 434.0], [90.3, 434.0], [90.4, 438.0], [90.5, 439.0], [90.6, 442.0], [90.7, 446.0], [90.8, 451.0], [90.9, 455.0], [91.0, 458.0], [91.1, 459.0], [91.2, 465.0], [91.3, 468.0], [91.4, 472.0], [91.5, 475.0], [91.6, 482.0], [91.7, 488.0], [91.8, 495.0], [91.9, 497.0], [92.0, 502.0], [92.1, 506.0], [92.2, 510.0], [92.3, 519.0], [92.4, 523.0], [92.5, 531.0], [92.6, 539.0], [92.7, 544.0], [92.8, 549.0], [92.9, 557.0], [93.0, 562.0], [93.1, 571.0], [93.2, 576.0], [93.3, 584.0], [93.4, 589.0], [93.5, 592.0], [93.6, 603.0], [93.7, 606.0], [93.8, 613.0], [93.9, 629.0], [94.0, 635.0], [94.1, 646.0], [94.2, 647.0], [94.3, 653.0], [94.4, 655.0], [94.5, 672.0], [94.6, 683.0], [94.7, 693.0], [94.8, 715.0], [94.9, 729.0], [95.0, 756.0], [95.1, 764.0], [95.2, 781.0], [95.3, 790.0], [95.4, 808.0], [95.5, 812.0], [95.6, 831.0], [95.7, 836.0], [95.8, 859.0], [95.9, 866.0], [96.0, 881.0], [96.1, 903.0], [96.2, 929.0], [96.3, 950.0], [96.4, 967.0], [96.5, 974.0], [96.6, 997.0], [96.7, 1026.0], [96.8, 1063.0], [96.9, 1085.0], [97.0, 1111.0], [97.1, 1121.0], [97.2, 1171.0], [97.3, 1206.0], [97.4, 1226.0], [97.5, 1288.0], [97.6, 1347.0], [97.7, 1378.0], [97.8, 1388.0], [97.9, 1428.0], [98.0, 1458.0], [98.1, 1474.0], [98.2, 1517.0], [98.3, 1571.0], [98.4, 1588.0], [98.5, 1657.0], [98.6, 1761.0], [98.7, 1958.0], [98.8, 2328.0], [98.9, 2522.0], [99.0, 2769.0], [99.1, 3130.0], [99.2, 4393.0], [99.3, 4590.0], [99.4, 4644.0], [99.5, 5377.0], [99.6, 5807.0], [99.7, 7665.0], [99.8, 8173.0], [99.9, 8674.0], [100.0, 8794.0]], "isOverall": false, "label": "GET /api/products (hot read path)", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 1479.0, "series": [{"data": [[0.0, 847.0], [8600.0, 5.0], [8200.0, 1.0], [8700.0, 1.0], [600.0, 42.0], [700.0, 21.0], [800.0, 26.0], [900.0, 19.0], [1000.0, 11.0], [1100.0, 12.0], [1200.0, 9.0], [1300.0, 10.0], [1400.0, 11.0], [1500.0, 10.0], [100.0, 1479.0], [1600.0, 5.0], [1700.0, 3.0], [1800.0, 1.0], [1900.0, 2.0], [2000.0, 1.0], [2100.0, 1.0], [2300.0, 2.0], [2400.0, 1.0], [2500.0, 3.0], [2700.0, 2.0], [2800.0, 3.0], [3100.0, 1.0], [200.0, 583.0], [3200.0, 1.0], [3300.0, 1.0], [4300.0, 1.0], [4500.0, 3.0], [4600.0, 3.0], [4400.0, 2.0], [300.0, 230.0], [5300.0, 4.0], [5500.0, 1.0], [5800.0, 1.0], [400.0, 96.0], [6700.0, 1.0], [7500.0, 1.0], [7600.0, 2.0], [7700.0, 1.0], [500.0, 56.0], [8100.0, 1.0], [8000.0, 1.0]], "isOverall": false, "label": "GET /api/products (hot read path)", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 8700.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 66.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 3236.0, "series": [{"data": [[0.0, 3236.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 216.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 66.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 17.668953687821606, "minX": 1.78169904E12, "maxY": 20.0, "series": [{"data": [[1.78169904E12, 17.668953687821606], [1.7816991E12, 20.0], [1.78169916E12, 19.85714285714286]], "isOverall": false, "label": "100 Concurrent Users", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78169916E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 76.8, "minX": 1.0, "maxY": 289.5062064789584, "series": [{"data": [[2.0, 115.0], [8.0, 93.88888888888889], [9.0, 80.63636363636364], [10.0, 91.6], [11.0, 93.0], [3.0, 95.5], [12.0, 106.08333333333333], [13.0, 115.45454545454545], [14.0, 185.8125], [15.0, 152.72222222222217], [4.0, 76.8], [16.0, 102.49999999999999], [1.0, 119.0], [17.0, 134.73684210526315], [18.0, 112.36842105263158], [19.0, 177.17391304347825], [5.0, 95.28571428571428], [20.0, 289.5062064789584], [6.0, 77.24999999999999], [7.0, 87.4]], "isOverall": false, "label": "GET /api/products (hot read path)", "isController": false}, {"data": [[19.557987492893687, 279.1813530415007]], "isOverall": false, "label": "GET /api/products (hot read path)-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 20.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 1496.3666666666666, "minX": 1.78169904E12, "maxY": 4.788041363333333E7, "series": [{"data": [[1.78169904E12, 1.7859418266666666E7], [1.7816991E12, 4.788041363333333E7], [1.78169916E12, 4.202972093333333E7]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.78169904E12, 1496.3666666666666], [1.7816991E12, 4011.7], [1.78169916E12, 3521.4666666666667]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78169916E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 173.44241982507313, "minX": 1.78169904E12, "maxY": 371.15738963531777, "series": [{"data": [[1.78169904E12, 281.4373927958831], [1.7816991E12, 371.15738963531777], [1.78169916E12, 173.44241982507313]], "isOverall": false, "label": "GET /api/products (hot read path)", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78169916E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 127.92857142857154, "minX": 1.78169904E12, "maxY": 250.06014075495895, "series": [{"data": [[1.78169904E12, 198.37049742710118], [1.7816991E12, 250.06014075495895], [1.78169916E12, 127.92857142857154]], "isOverall": false, "label": "GET /api/products (hot read path)", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78169916E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.0, "minX": 1.78169904E12, "maxY": 0.09948542024013711, "series": [{"data": [[1.78169904E12, 0.09948542024013711], [1.7816991E12, 0.012795905310300714], [1.78169916E12, 0.0]], "isOverall": false, "label": "GET /api/products (hot read path)", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78169916E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 42.0, "minX": 1.78169904E12, "maxY": 8794.0, "series": [{"data": [[1.78169904E12, 1958.0], [1.7816991E12, 8794.0], [1.78169916E12, 853.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.78169904E12, 579.4000000000004], [1.7816991E12, 584.0], [1.78169916E12, 310.10000000000014]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.78169904E12, 1593.439999999999], [1.7816991E12, 5630.999999999973], [1.78169916E12, 648.8899999999999]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.78169904E12, 964.5999999999995], [1.7816991E12, 1144.9999999999989], [1.78169916E12, 384.6999999999998]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.78169904E12, 51.0], [1.7816991E12, 42.0], [1.78169916E12, 50.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.78169904E12, 178.0], [1.7816991E12, 149.0], [1.78169916E12, 137.5]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78169916E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 65.0, "minX": 1.0, "maxY": 7654.5, "series": [{"data": [[33.0, 201.0], [32.0, 169.5], [35.0, 183.0], [34.0, 177.5], [36.0, 151.0], [37.0, 150.5], [39.0, 143.0], [38.0, 153.0], [40.0, 150.5], [41.0, 126.0], [42.0, 114.0], [43.0, 119.0], [45.0, 115.0], [44.0, 112.0], [3.0, 1464.0], [4.0, 7654.5], [6.0, 439.0], [7.0, 65.0], [9.0, 4596.0], [10.0, 219.0], [11.0, 646.0], [13.0, 643.0], [15.0, 530.0], [1.0, 2828.0], [20.0, 1211.0], [21.0, 100.5], [22.0, 155.5], [23.0, 337.0], [24.0, 166.0], [26.0, 124.5], [28.0, 531.0], [29.0, 296.0], [30.0, 164.0], [31.0, 206.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 45.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 48.0, "minX": 1.0, "maxY": 3747.5, "series": [{"data": [[33.0, 133.0], [32.0, 129.5], [35.0, 127.0], [34.0, 128.5], [36.0, 112.0], [37.0, 108.0], [39.0, 103.0], [38.0, 111.5], [40.0, 109.0], [41.0, 92.0], [42.0, 84.0], [43.0, 87.0], [45.0, 84.0], [44.0, 80.0], [3.0, 755.0], [4.0, 3747.5], [6.0, 326.0], [7.0, 48.0], [9.0, 2199.5], [10.0, 149.5], [11.0, 449.0], [13.0, 517.0], [15.0, 371.5], [1.0, 813.0], [20.0, 632.5], [21.0, 71.0], [22.0, 119.0], [23.0, 253.0], [24.0, 128.0], [26.0, 83.0], [28.0, 364.0], [29.0, 218.0], [30.0, 117.0], [31.0, 151.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 45.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 9.833333333333334, "minX": 1.78169904E12, "maxY": 26.1, "series": [{"data": [[1.78169904E12, 9.833333333333334], [1.7816991E12, 26.1], [1.78169916E12, 22.7]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78169916E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 9.716666666666667, "minX": 1.78169904E12, "maxY": 26.05, "series": [{"data": [[1.78169904E12, 9.716666666666667], [1.7816991E12, 26.05], [1.78169916E12, 22.866666666666667]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.78169916E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 9.716666666666667, "minX": 1.78169904E12, "maxY": 26.05, "series": [{"data": [[1.78169904E12, 9.716666666666667], [1.7816991E12, 26.05], [1.78169916E12, 22.866666666666667]], "isOverall": false, "label": "GET /api/products (hot read path)-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78169916E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 9.716666666666667, "minX": 1.78169904E12, "maxY": 26.05, "series": [{"data": [[1.78169904E12, 9.716666666666667], [1.7816991E12, 26.05], [1.78169916E12, 22.866666666666667]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.78169916E12, "title": "Total Transactions Per Second"}},
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

