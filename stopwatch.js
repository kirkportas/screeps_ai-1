var roleHauler = {

    timeSinceStart: function() {
      var timeNow= Game.cpu.getUsed();
      console.log(timeNow);
	},
  start: function() {
    Memory.test=0;
  }

};

module.exports = roleHauler;
