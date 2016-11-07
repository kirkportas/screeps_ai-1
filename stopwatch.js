var roleHauler = {

    timeSinceLast: function() {
      var timeNow= Game.cpu.getUsed()-test;
      test=timeNow;
      console.log(timeNow);
	},
  start: function() {
    
  }

};

module.exports = roleHauler;
