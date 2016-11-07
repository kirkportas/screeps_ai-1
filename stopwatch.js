var roleHauler = {

    timeSinceLast: function() {
      var timeNow= Game.cpu.getUsed()-Memory.test;
      Memory.test=timeNow;
      console.log(timeNow);
	},
  start: function() {
    Memory.test=1;
  }

};

module.exports = roleHauler;
