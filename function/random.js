module.exports = function(controller){
    controller.hears(['\\(car+\\)'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
        var index = Math.floor((Math.random() * 3));
        switch(index) {
            case 0:
                bot.reply(message, "紅色開運 :car:");
                break;
            case 1:
                bot.reply(message, "一台小黃 :taxi:");
                break;
            case 2:
                bot.reply(message, "平凡無奇的車款 :blue_car:");
                break;
        }
    });

    controller.hears(['\\(su+it\\)', '\\(color+\\)'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
        var index = Math.floor((Math.random() * 4));
        switch(index) {
            case 0:
                bot.reply(message, "黑桃老大！ :spades:");
                break;
            case 1:
                bot.reply(message, "獻給妳我的心~ :heart:");
                break;
            case 2:
                bot.reply(message, "梅花梅花幾月開 :clubs:");
                break;
            case 3:
                bot.reply(message, "鑽石恆久遠 一顆就破產 :diamonds:");
                break;
        }
    });
};