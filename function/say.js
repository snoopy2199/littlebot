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

module.exports = function(controller){
    controller.hears(['你怎麼看', '你說呢', '你覺得呢', '你怎麼想'], 'direct_message,direct_mention,mention', function(bot, message) {
        var index = Math.floor((Math.random() * OPINION.length));
        bot.reply(message, OPINION[index]);
    });
};