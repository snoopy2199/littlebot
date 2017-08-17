var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var cheerio = require("cheerio");

module.exports = function(controller, bot){
    controller.hears(['Daily'], 'direct_message,direct_mention,mention', function(bot, message) {
        getDaily(message, bot);
    });
};

function getDaily(message, bot) {
    var url = "http://www.dailyenglishquote.com/";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var $ = cheerio.load(this.responseText, {decodeEntities: false});

            var daily = {};
            daily.quote = $(".entry.cf").eq(0).find("strong").text();
            daily.from = $(".entry.cf").eq(0).find("div").eq(2).text();
            daily.chinese = $(".entry.cf").eq(0).find("p").eq(1).text();

            bot.reply(message, ">>>" + daily.quote + "\n" + daily.from);
            bot.reply(message, daily.chinese);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}