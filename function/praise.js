module.exports = function(controller){
    controller.hears(['好棒', '太棒', '超棒', '真棒', '棒棒'], 'direct_message,direct_mention,mention', function(bot, message) {
        bot.reply(message, "因為你的一句讚美讓littlebot變得更好 :heshy2:");
    });
};