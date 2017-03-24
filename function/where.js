module.exports = function(controller){
    controller.hears(['littlebot在哪裡', 'Where is littlebot'],
    'direct_message,direct_mention,mention,ambient', function(bot, message) {
        bot.reply(message,'Here! :ran_ran_ru_1:');
    });
};