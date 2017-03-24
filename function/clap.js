module.exports = function(controller){
    controller.hears([':heclap:'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
        bot.reply(message, ":heclap:");
    });
};