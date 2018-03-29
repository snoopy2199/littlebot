var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var AQIList;

module.exports = function(controller){
    loadAQI();

    controller.hears(['的空氣$'], 'direct_message,direct_mention,mention', function(bot, message) {
        var site = message.text.split('的空氣')[0];

        if (site === '台灣') {
            bot.reply(message, 'https://taqm.epa.gov.tw/taqm/Chart/AqiMap/map2.aspx?ts=' + (new Date()).getTime());
            return;
        } else if (!(site in AQIList)) {
            bot.reply(message, '沒有' + site + '的空氣資料啊 :thinking_face:');
            return;
        }

        loadAQI(function() {
            var data = AQIList[site];
            var aqi = data.AQI;
            var time = new Date(data.Time).getTime() / 1000;
            var level = data.AQIStyle;

            var color, text, review;
            switch (level) {
                case 'AQI1':
                    color = '#00e800';
                    text = '良好';
                    review = pickOne([
                        '哎呦，不錯哦！',
                        ':heclap::heclap::heclap:'
                    ]);
                    break;
                case 'AQI2':
                    color = '#ffff00';
                    text = '普通';
                    review = pickOne([
                        '普普通通普普通通',
                        '普通就是福啊！'
                    ]);
                    break;
                case 'AQI3':
                    color = '#ff7e00';
                    text = '對敏感族群不健康';
                    review = pickOne([
                        '(・Д・)つ口罩',
                        ':he_amaze:',
                    ]);
                    break;
                case 'AQI4':
                    color = '#ff0000';
                    text = '對所有族群不健康';
                    review = pickOne([
                        '塊陶啊！',
                        '地球很危險的，快回火星吧！'
                    ]);
                    break;
                case 'AQI5':
                    color = '#8f3f97';
                    text = '非常不健康';
                    review = pickOne([
                        ':scream:',
                        ':harryscream:'
                    ]);
                    break;
                case 'AQI6':
                    color = '#7e0023';
                    text = '危害';
                    review = pickOne([
                        ':skull_and_crossbones:'
                    ]);
                    break;
            }

            var reply = {
                'attachments': [{
                    'color': color,
                    'pretext': review,
                    'author_name': site,
                    'title': 'AQI ' + aqi,
                    'title_link': 'https://taqm.epa.gov.tw/taqm/tw/b0203.aspx',
                    'text': text,
                    'footer': '行政院環境保護署',
                    'footer_icon': 'http://www.library.com.tw/images/IMG/L00073-1.gif',
                    'ts': time
                }]
            };

            bot.reply(message, reply);
        });
    });
};

function loadAQI(callback) {
    var url = 'https://taqm.epa.gov.tw/taqm/aqs.ashx?lang=tw&act=aqi-epa&ts=' + (new Date()).getTime();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var responseJSON = JSON.parse(this.responseText).Data;
            AQIList = {};
            responseJSON.forEach(function(element) {
                AQIList[element.SiteName] = element;
            });

            if (callback && typeof callback === "function") {
                callback();
            }
        }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
}

function pickOne(array) {
    var lucky = Math.floor((Math.random() * array.length));
    return array[lucky];
}