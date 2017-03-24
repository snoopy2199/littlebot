var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var HOROSCOPE_C = ['摩羯', '水瓶', '雙魚', '牡羊', '金牛', '雙子',
                   '巨蟹', '獅子', '處女', '天秤', '天蠍', '射手'];
var HOROSCOPE_E = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
                   'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'];

module.exports = function(controller, bot){
    controller.hears(HOROSCOPE_C, 'direct_message,direct_mention,mention', function(bot, message) {
        var match = message.match[0];
        var index = HOROSCOPE_C.indexOf(match);
        match = HOROSCOPE_E[index];

        doHoroscope(bot, message, match);
    });

    function doHoroscope(bot, message, horoscope) {
        bot.api.reactions.add({
            timestamp: message.ts,
            channel: message.channel,
            name: 'read',
        }, function(err, res) {
            if (err) {
                bot.botkit.log('Failed to add emoji reaction :(', err);
            }
        });
        getHoroscope(horoscope, message);
    }

    function getHoroscope(constellations, message) {
        var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.daily-zodiac.com%2Fmobile%2Fzodiac%2F" +
                  constellations + "%22&format=json&diagnostics=true&callback=";

        if (constellations == "Scorpio") {
            constellations = "scorpius";
        }

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var content = JSON.parse(this.responseText).query.results.body.div.div.div.div.div[0].div;

                var horoscope = {};
                horoscope.name = content[0].p[0].content + " :" + constellations + ":";
                horoscope.today = content[2].ul.li[1].content + content[2].ul.li[1].span.content;
                horoscope.weather = content[2].ul.li[2].span.content;
                horoscope.article = content[2].section.article;

                switch(horoscope.weather) {
                    case "晴":
                        horoscope.weather += " :sunny:";
                        break;
                    case "晴時多雲":
                        horoscope.weather += " :mostly_sunny:";
                        break;
                    case "陰":
                        horoscope.weather += " :cloud:";
                        break;
                    case "雨":
                        horoscope.weather += " :rain_cloud:";
                        break;
                    case "打雷閃電":
                        horoscope.weather += " :thunder_cloud_and_rain:";
                        break;
                }

                bot.reply(message, horoscope.name + " " + horoscope.today);
                bot.reply(message, horoscope.weather);
                bot.reply(message, horoscope.article);
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }
};