module.exports = function(controller){
    controller.hears(['幫我選'], 'direct_message,direct_mention,mention', function(bot, message) {
        var text = message.text;
        var select = text.split("幫我選");
        if (select[1] == "") {
            bot.reply(message, "No comment.");
            return;
        }

        select = select[1].trim();
        select = select.split(" ");
        var answer = select[Math.floor((Math.random() * select.length))];

        var index = Math.floor((Math.random() * 4));
        switch(index) {
            case 0:
                bot.reply(message, "專業推薦" + answer);
                break;
            case 1:
                bot.reply(message, "私心推薦" + answer);
                break;
            case 2:
                bot.reply(message, "強烈建議" + answer);
                break;
            case 3:
                bot.reply(message, "隨便選選" + answer);
                break;
        }
    });
};