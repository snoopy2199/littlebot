var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(controller){
    controller.hears(['Daily'], 'direct_message,direct_mention,mention', function(bot, message) {
        getDaily(message);
    });
};

function getDaily(message) {
    var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.dailyenglishquote.com%2F'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var content = JSON.parse(this.responseText).query.results.body.div[3].div[1].div[0].div[2];

            var daily = {};
            daily.quote = content.p[0].strong.content;
            if (typeof(daily.quote) === "undefined") {
                daily.quote = content.p[0].strong.span.content;
            }

            daily.from = content.div[2].content;
            daily.chinese = content.p[1];

            bot.reply(message, ">>>" + daily.quote + "\n" + daily.from);
            bot.reply(message, daily.chinese);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}