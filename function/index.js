module.exports = function(controller, bot){
    var alias = require("./alias.js")(controller);
    var bug = require("./bug.js")(controller);
    var choice = require("./choice.js")(controller);
    var clap = require("./clap.js")(controller);
    var daily = require("./daily.js")(controller);
    var here = require("./here.js")(controller);
    var horoscope = require("./horoscope.js")(controller, bot);
    var praise = require("./praise.js")(controller);
    var random = require("./random.js")(controller);
    var reaction = require("./reaction.js")(controller);
    var rock_paper_scissors = require("./rock_paper_scissors.js")(controller);
    var say = require("./say.js")(controller);
    var shutdown = require("./shutdown.js")(controller);
    var where = require("./where.js")(controller);
}