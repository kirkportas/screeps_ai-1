var tasks = require('tasks');

var roleScout = {

    run: function(creep) {
      var anotherRoomName='E65S61';
      if(creep.room != anotherRoomName) {
        creep.say('room1');
        var exitDir = Game.map.findExit(creep.room, anotherRoomName);
        var exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);
      } else {
        creep.say('room2');
        console.log('-----------in other room');
        tasks.harvestClosest(creep);
      }
    }
};

module.exports = roleScout;
