module.exports = function(controller){
    controller.hears([':bug:','\\(bug+\\)'],
    'direct_message,direct_mention,mention,ambient', function(bot, message) {

        var channelId = message.channel;

        getRandomId(bot,channelId, function(response) {
            if(typeof response.group.members != 'undefined') {
                var members = response.group.members;
                var index = members.indexOf('U20PN90N5');
                if (index > -1) {
                    members.splice(index, 1);
                }
                var answer = members[Math.floor((Math.random() * members.length))];

                bot.reply(message, 'Bug 是 <@' + answer + '> 的!');
            }
        });
    });
};

function getRandomId(bot, id, callback) {

    bot.api.groups.info({token: process.env.token ,channel: id},function(err,response) {
        return callback(response);
    });

}