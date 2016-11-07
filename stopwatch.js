var roleHauler = {

    timeSinceLast: function() {
      var timeNow= Game.cpu.getUsed()-test;
      test=timeNow;
      console.log(timeNow);
	},
  start: function() {
    var test=0;
  }

};

module.exports = roleHauler;
