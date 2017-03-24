module.exports = function(controller){
    controller.hears(['@here'],
    'direct_message,direct_mention,mention,ambient', function(bot, message) {
        bot.api.reactions.add({
            timestamp: message.ts,
            channel: message.channel,
            name: 'raised_hand_with_fingers_splayed',
        }, function(err, res) {
            if (err) {
                bot.botkit.log('Failed to add emoji reaction :(', err);
            }
        });
    });
};