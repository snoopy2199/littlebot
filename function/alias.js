module.exports = function(controller){
    controller.hears(['alias'],
    'direct_message,direct_mention,mention,ambient', function(bot, message) {
        if(message.event == 'direct_message'){

            getGroupsList(bot, function(response){
                var check = message.text.match(/^alias <@([A-Za-z0-9])+>(\s)/);
                var alias_message = message.text.replace(/^alias <@([A-Za-z0-9])+>(\s)\(([A-Za-z0-9_-])+\)(\s)/, "");
                var channel_name = message.text.match(/\(([A-Za-z0-9_-])+\)/, "");

                if(check!=null && channel_name!= null){
                    var alias_user = check[0].replace("alias", "").replace(/([^A-Za-z0-9])+/, "").replace(/([^A-Za-z0-9])+$/, "");
                    channel_name=channel_name[0].replace("(","").replace(")","");
                    console.log(channel_name);
                    console.log(alias_message);
                    console.log(response.groups.length);
                    var channel_id = null;
                    for(var i=0 ; i < response.groups.length ; i++){
                        if(channel_name == response.groups[i].name){
                            channel_id = response.groups[i].id;
                            break;

                        }
                    }
                    user_id = null;
                    if(channel_id != null){
                        console.log(channel_id);
                        getRandomId(bot,channel_id, function(response){
                            if(typeof response.group.members != 'undefined'){
                                var members = response.group.members;
                                for (var i=0; i<members.length;i++){
                                    if(alias_user == members[i]){
                                        user_id = alias_user;
                                        break;
                                    }
                                }
                            }
                            if(user_id!=null){
                                changeIdToName(bot, user_id, function(response){
                                    if(response!=null) {
                                        var image_url = "";
                                        if(typeof response.user.profile.image_original != 'undefined'){
                                            image_url = response.user.profile.image_original;
                                        }else{
                                            image_url = response.user.profile.image_512.match(/d=.+/,"");
                                            if(image_url!=null){
                                                image_url = image_url[0].replace('d=',"");
                                                image_url = decodeURIComponent(image_url);
                                            }
                                        }

                                        var http = require('https');
                                        var options = {
                                            host: 'slack.com',
                                            path: '/api/chat.postMessage?token='+process.env.token+'&channel='+channel_name+'&text=' + encodeURI(alias_message) + '&icon_url='+encodeURI(image_url)+'&username=' + response.user.name + '&pretty=1'
                                        };
                                        var req = http.get(options, function (res) {

                                        });

                                        req.on('error', function (e) {
                                            console.log('ERROR: ' + e.message);
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });

        }
    });
};

function getRandomId(bot, id, callback) {

    bot.api.groups.info({token: process.env.token ,channel: id},function(err,response) {
        return callback(response);
    });

}
function getChannelsList(bot, callback) {

    bot.api.channels.list({token: process.env.token },function(err,response) {
        return callback(response);
    });

}
function changeIdToName(bot, id, callback) {

    bot.api.users.info({token: process.env.token,user: id},function(err,response) {
        return callback(response);
    });

}
function getGroupsList(bot, callback) {

    bot.api.groups.list({token: process.env.token },function(err,response) {
        return callback(response);
    });

}