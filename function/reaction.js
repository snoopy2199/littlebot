module.exports = function(controller){
    controller.on('reaction_added', function(bot, message) {
        if ((message.item_user == "U20PN90N5") && (message.reaction.indexOf("+1") > -1)) {
            bot.reply(message.item, "<@" + message.user + ">成為了我的小粉絲 :heshy2:");
        }
    });

    controller.on('reaction_removed', function(bot, message) {
        if ((message.item_user == "U20PN90N5") && (message.reaction.indexOf("+1") > -1)) {
            bot.reply(message.item, "<@" + message.user + ">還我讚來 :he_hate:");
        }
    });
};