var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

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
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});

///////////////////////////////////////////////////////////////////////////////////////

controller.hears(['littlebot在哪裡', 'Where is littlebot'],
    'direct_message,direct_mention,mention,ambient', function(bot, message) {
        bot.reply(message,'Here! :ran_ran_ru_1:');
});

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

controller.hears(['摩羯'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'read',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    getHoroscope("Capricorn", message);
});

controller.hears(['水瓶'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'read',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    getHoroscope("Aquarius", message);
});

controller.hears(['雙魚'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'read',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    getHoroscope("Pisces", message);
});

controller.hears(['牡羊'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'read',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    getHoroscope("Aries", message);
});

controller.hears(['金牛'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'read',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    getHoroscope("Taurus", message);
});

controller.hears(['雙子'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'read',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    getHoroscope("Gemini", message);
});

controller.hears(['巨蟹'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'read',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    getHoroscope("Cancer", message);
});

controller.hears(['獅子'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'read',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    getHoroscope("Leo", message);
});

controller.hears(['處女'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'read',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    getHoroscope("Virgo", message);
});

controller.hears(['天秤'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'read',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    getHoroscope("Libra", message);
});

controller.hears(['天蠍'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'read',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    getHoroscope("Scorpio", message);
});

controller.hears(['射手'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'read',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    getHoroscope("Sagittarius", message);
});

function getHoroscope(constellations, message) {
    var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.daily-zodiac.com%2Fmobile%2Fzodiac%2F" +
              constellations + "%22&format=json&diagnostics=true&callback=";

    if (constellations == "Scorpio") {
        constellations = "scorpius";
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var content = JSON.parse(this.responseText).query.results.body.div.div.div.div.div[0].div;

            var horoscope = {};
            horoscope.name = content[0].p[0].content + " :" + constellations + ":";
            horoscope.today = content[2].ul.li[1].content + content[2].ul.li[1].span.content;
            horoscope.weather = content[2].ul.li[2].span.content;
            horoscope.article = content[2].section.article;

            switch(horoscope.weather) {
                case "晴":
                    horoscope.weather += " :sunny:";
                    break;
                case "晴時多雲":
                    horoscope.weather += " :mostly_sunny:";
                    break;
                case "陰":
                    horoscope.weather += " :cloud:";
                    break;
                case "雨":
                    horoscope.weather += " :rain_cloud:";
                    break;
                case "打雷閃電":
                    horoscope.weather += " :thunder_cloud_and_rain:";
                    break;
            }

            bot.reply(message, horoscope.name + " " + horoscope.today);
            bot.reply(message, horoscope.weather);
            bot.reply(message, horoscope.article);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

controller.hears(['你怎麼看'], 'direct_message,direct_mention,mention', function(bot, message) {
    var index = Math.floor((Math.random() * 10));
    switch(index) {
        case 0:
            bot.reply(message, "別再問了，我什麼都不知道 :he_amaze:");
            break;
        case 1:
            bot.reply(message, "清官難斷家務事");
            break;
        case 2:
            bot.reply(message, "No comment.");
            break;
        case 3:
            bot.reply(message, "假的！");
            break;
        case 4:
            bot.reply(message, ":he_hate:");
            break;
        case 5:
            bot.reply(message, "我什麼都不知道");
            break;
        case 6:
            bot.reply(message, "列入littlebot的十大不解謎團！");
            break;
        case 7:
            bot.reply(message, "千江水　千江月　千里帆　千重山　千里江山　我最水～～～～～");
            break;
        case 8:
            bot.reply(message, "https://www.youtube.com/watch?v=bvgd5EzAELg");
            break;
        case 9:
            bot.reply(message, "有沒有人要來點爆米花？ :eateateat:");
            break;
    }
});

controller.hears(['訂便當'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, {
    "text": "*商家列表* - Page 1 of 10",
    "attachments": [
        {
            "text": "商家名稱1",
            "fields": [
                {
                    "title": "商家編號",
                    "value": "#001",
                    "short": true
                },
                {
                    "title": "商家類別",
                    "value": "音樂類",
                    "short": true
                },
                {
                    "title": "商家電話",
                    "value": "07-3456789",
                    "short": true
                },
                {
                    "title": "商家評比",
                    "value": "5顆星",
                    "short": true
                },
                {
                    "title": "最低開團金額",
                    "value": "5000",
                    "short": true
                },
                {
                    "title": "商家地址",
                    "value": "高雄市前鎮區復興二路",
                    "short": false
                }
            ],
            "fallback": "You are unable to choose a store",
            "callback_id": "store",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "detail",
                    "text": "Detail",
                    "type": "button",
                    "value": "detail"
                },
                {
                    "name": "create_group",
                    "text": "開團",
                    "style": "danger",
                    "type": "button",
                    "value": "create_group",
                    "confirm": {
                        "title": "開團",
                        "text": "確定開團嗎？",
                        "ok_text": "Yes",
                        "dismiss_text": "No"
                    }
                }
            ]
        },
        {
            "text": "商家名稱2",
            "fields": [
                {
                    "title": "商家編號",
                    "value": "#002",
                    "short": true
                },
                {
                    "title": "商家類別",
                    "value": "OO類",
                    "short": true
                },
                {
                    "title": "商家電話",
                    "value": "07-5439876",
                    "short": true
                },
                {
                    "title": "商家評比",
                    "value": "1顆星",
                    "short": true
                },
                {
                    "title": "最低開團金額",
                    "value": "0",
                    "short": true
                },
                {
                    "title": "商家地址",
                    "value": "高雄市前鎮區復興二路",
                    "short": false
                }
            ],
            "fallback": "You are unable to choose a store",
            "callback_id": "store",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "detail",
                    "text": "Detail",
                    "type": "button",
                    "value": "detail"
                },
                {
                    "name": "create_group",
                    "text": "開團",
                    "style": "danger",
                    "type": "button",
                    "value": "create_group",
                    "confirm": {
                        "title": "開團",
                        "text": "確定開團嗎？",
                        "ok_text": "Yes",
                        "dismiss_text": "No"
                    }
                }
            ]
        },
        {
            "fallback": "You are unable to choose a store",
            "callback_id": "store",
            "color": "#FFFFFF",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "prev",
                    "text": "上一頁",
                    "type": "button",
                    "value": "detail"
                },
                {
                    "name": "next",
                    "text": "下一頁",
                    "type": "button",
                    "value": "detail"
                }
            ]
        }
    ]
    });
});

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