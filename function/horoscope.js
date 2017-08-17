var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var cheerio = require("cheerio");

var HOROSCOPE_C = ['摩羯', '水瓶', '雙魚', '牡羊', '金牛', '雙子',
                   '巨蟹', '獅子', '處女', '天秤', '天蠍', '射手'];
var HOROSCOPE_E = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
                   'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'];

module.exports = function(controller){
    controller.hears(HOROSCOPE_C, 'direct_message,direct_mention,mention', function(bot, message) {
        var match = message.match[0];
        var index = HOROSCOPE_C.indexOf(match);
        match = HOROSCOPE_E[index];

        doHoroscope(bot, message, match);
    });
};

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
    getHoroscope(bot, message, horoscope);
}

function getHoroscope(bot, message, constellations) {
    var url = "http://www.daily-zodiac.com/mobile/zodiac/" + constellations;

    if (constellations == "Scorpio") {
        constellations = "scorpius";
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var $ = cheerio.load(this.responseText, {decodeEntities: false});

            var horoscope = {};
            horoscope.name = $(".middle p.name").eq(0).text().trim();
            horoscope.today = $(".middle .today li").eq(1).text().trim();
            horoscope.weather = $(".middle .today li").eq(2).text().trim();
            horoscope.article = $(".middle article").eq(0).text().trim();

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