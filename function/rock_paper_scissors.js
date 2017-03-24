module.exports = function(controller){
    controller.hears(['猜拳'], 'direct_message,direct_mention,mention', function(bot, message) {
        bot.startConversation(message, function(err, convo) {
            if (!err) {
                convo.ask('剪刀～石頭～～～～', function(response, convo) {
                    var v = response.text.indexOf(":v:");
                    var o = response.text.indexOf(":fist:");
                    var w1 = response.text.indexOf(":raised_hand_with_fingers_splayed:");
                    var w2 = response.text.indexOf(":hand:");
                    var w = w1 == -1 ? w2 : w1;

                    var re = 0;
                    if (v == -1) re++;
                    if (o == -1) re++;
                    if (w == -1) re++;

                    if (re != 2) {
                        re = -1;
                    } else {
                        if (v > -1) {
                            re = 1;
                        } else if (o > -1) {
                            re = 2;
                        } else {
                            re = 3;
                        }
                    }

                    var index = Math.floor((Math.random() * 3) + 1);
                    switch(index) {
                        case 1:
                            convo.say("布！ :v::skin-tone-2:");
                            switch(re) {
                                case -1:
                                    convo.say("遇上賴皮鬼OAO");
                                    break;
                                case 1:
                                    convo.say("平手");
                                    break;
                                case 2:
                                    convo.say("哼！算你好運");
                                    break;
                                case 3:
                                    convo.say("勝利是站在正義的一方♫");
                                    break;
                            }
                            break;
                        case 2:
                            convo.say("布！ :fist::skin-tone-2:");
                            switch(re) {
                                case -1:
                                    convo.say("你沒玩過猜拳嗎？");
                                    break;
                                case 1:
                                    convo.say("登登登登 恭喜littlebot");
                                    break;
                                case 2:
                                    convo.say("我們還算有默契");
                                    break;
                                case 3:
                                    convo.say("這不科學！");
                                    break;
                            }
                            break;
                        case 3:
                            convo.say("布！ :raised_hand_with_fingers_splayed::skin-tone-2:");
                            switch(re) {
                                case -1:
                                    convo.say(":v::skin-tone-2: 、 :fist::skin-tone-2: 、或是 :raised_hand_with_fingers_splayed::skin-tone-2: ！");
                                    break;
                                case 1:
                                    convo.say("我下次一定會贏你！");
                                    break;
                                case 2:
                                    convo.say("再回去練練吧～");
                                    break;
                                case 3:
                                    convo.say("擊掌！");
                                    break;
                            }
                            break;
                    }

                    convo.next();
                });
            }
        });
    });
};