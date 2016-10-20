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

var HOROSCOPE_C = ['摩羯', '水瓶', '雙魚', '牡羊', '金牛', '雙子',
                   '巨蟹', '獅子', '處女', '天秤', '天蠍', '射手'];
var HOROSCOPE_E = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
                   'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'];
controller.hears(HOROSCOPE_C, 'direct_message,direct_mention,mention', function(bot, message) {
    var match = message.match[0];
    var index = HOROSCOPE_C.indexOf(match);
    match = HOROSCOPE_E[index];

    doHoroscope(bot, message, match);
});

function doHoroscope(bot, message, horoscope) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'read',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    getHoroscope(horoscope, message);
}

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

var OPINION = ["別再問了，我什麼都不知道 :he_amaze:",
               "清官難斷家務事",
               "No comment.",
               "假的！",
               ":he_hate:",
               "我什麼都不知道",
               "列入littlebot的十大不解謎團！",
               "千江水　千江月　千里帆　千重山　千里江山　我最水～～～～～",
               "https://www.youtube.com/watch?v=bvgd5EzAELg",
               "有沒有人要來點爆米花？ :eateateat:",
               "警察杯杯 就是這個人 :oncoming_police_car:",
               "想問天～問大地～～或者是迷信問問宿命～～～",
               "I have an apple :computer:",
               "初一吃素 初二吃素 初三吃素 初四吃素 初五吃素 初六吃素 初七吃素 初八吃素 初九吃素 初十吃素",
               "只好發到就可版 :he:",
               "只好猜拳決勝負 :v::skin-tone-2: :fist::skin-tone-2: :raised_hand_with_fingers_splayed::skin-tone-2:",
               "請受小的一拜 :worship2:",
               "明早一覺醒來你會發現...什麼事都沒有改變",
               "你的名字是？",
               "體 悟 心 靈 祥 和",
               "啊不就好棒棒 :haobonbon:",
               "需要緊急hotfix",
               "沒救惹 :yaoming:"];
controller.hears(['你怎麼看', '你說呢', '你覺得呢', '你怎麼想'], 'direct_message,direct_mention,mention', function(bot, message) {
    var index = Math.floor((Math.random() * OPINION.length));
    bot.reply(message, OPINION[index]);
});

controller.hears(['(car+)'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
    var index = Math.floor((Math.random() * 3));
    switch(index) {
        case 0:
            bot.reply(message, "紅色開運 :car:");
            break;
        case 1:
            bot.reply(message, "一台小黃 :taxi:");
            break;
        case 2:
            bot.reply(message, "平凡無奇的車款 :blue_car:");
            break;
    }
});

controller.hears(['(su+it)', '(color+)'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
    var index = Math.floor((Math.random() * 4));
    switch(index) {
        case 0:
            bot.reply(message, "黑桃老大！ :spades:");
            break;
        case 1:
            bot.reply(message, "獻給妳我的心~ :heart:");
            break;
        case 2:
            bot.reply(message, "梅花梅花幾月開 :clubs:");
            break;
        case 3:
            bot.reply(message, "鑽石恆久遠 一顆就破產 :diamonds:");
            break;
    }
});

controller.hears(['幫我選'], 'direct_message,direct_mention,mention', function(bot, message) {
    var text = message.text;
    var select = text.split("幫我選");
    if (select[1] == "") {
        bot.reply(message, "No comment.");
        return;
    }

    select = select[1].trim();
    select = select.split(" ");
    var answer = select[Math.floor((Math.random() * select.length))];

    var index = Math.floor((Math.random() * 4));
    switch(index) {
        case 0:
            bot.reply(message, "專業推薦" + answer);
            break;
        case 1:
            bot.reply(message, "私心推薦" + answer);
            break;
        case 2:
            bot.reply(message, "強烈建議" + answer);
            break;
        case 3:
            bot.reply(message, "隨便選選" + answer);
            break;
    }
});

controller.hears([':heclap:'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
    bot.reply(message, ":heclap:");
});

controller.hears(['好棒', '太棒', '超棒'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "因為你的一句讚美讓littlebot變得更好 :heshy2:");
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