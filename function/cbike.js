var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var stationList;

module.exports = function(controller){
    loadStation();

    controller.hears(['^c-bike'], 'direct_message,direct_mention,mention', function(bot, message) {
        var msg = message.text.split(' ');

        if (msg.length !== 2) {
            bot.reply(message, '請告訴我要查詢的站點名稱');
            return;
        }

        var station = msg[1].replace(/站/g, '');
        if (!(station in stationList)) {
            bot.reply(message, '沒有' + station + '這個站點耶 :hushed:');
            return;
        }

        loadStation(function() {
            var data = stationList[station].properties;
            var time = new Date(data.updateTime).getTime() / 1000;

            var reply = {
                'attachments': [{
                    'color': '#1e37af',
                    'author_name': data.title,
                    "fields": [
                        {
                            "title": "單車數",
                            "value": data.availableCarCount,
                            "short": true
                        },
                        {
                            "title": "空位數",
                            "value": data.availableSpaceCount,
                            "short": true
                        }
                    ],
                    'footer': '高雄市公共腳踏車資訊網',
                    'footer_icon': 'https://www.c-bike.com.tw/Content/images/CBike.jpg',
                    'ts': time
                }]
            };

            bot.reply(message, reply);
        });
    });
};

function loadStation(callback) {
    var url = 'https://www.c-bike.com.tw/Portal/Station/GetStations?lat=22.70255338026487&lng=120.28497794351847&zoom=12';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var responseJSON = JSON.parse(this.responseText).features;
            stationList = {};
            responseJSON.forEach(function(element) {
                var title = element.properties.title;
                var replaceTitle = title.replace(/站/g, '');
                stationList[replaceTitle] = element;

                if (replaceTitle.search(/\(\d+\)/) >= 0) {
                    var station = replaceTitle.replace(/\(\d+\)/, '');
                    var data = element.properties;
                    var updateTime =  new Date(data.updateTime).getTime();

                    if (station in stationList) {
                        var mergeData = stationList[station].properties;
                        mergeData.title += ' & ' + title;
                        mergeData.availableCarCount += data.availableCarCount;
                        mergeData.availableSpaceCount += data.availableSpaceCount;
                        mergeData.updateTime = updateTime > mergeData.updateTime ? updateTime : mergeData.updateTime;
                    } else {
                        stationList[station] = {
                            properties: {
                                title: title,
                                availableCarCount: data.availableCarCount,
                                availableSpaceCount: data.availableSpaceCount,
                                updateTime: updateTime
                            }
                        }
                    }
                }
            });

            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
}