module.exports = function(controller){
    controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function(bot, message) {
        bot.startConversation(message, function(err, convo) {
            convo.ask('Are you sure you want me to shutdown?', [
                {
                    pattern: bot.utterances.yes,
                    callback: function(response, convo) {
                        convo.say('Bye!');
                        convo.next();
                        setTimeout(function() {
                            process.exit();
                        }, 3000);
                    }
                },{
                    pattern: bot.utterances.no,
                    default: true,
                    callback: function(response, convo) {
                        convo.say('*Phew!*');
                        convo.next();
                    }
                }]);
        });
    });
};