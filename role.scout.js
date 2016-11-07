var tasks = require('tasks');

var roleScout = {

    run: function(creep) {
      var anotherRoomName='E65S61';
      if(creep.room != anotherRoomName) {
        var exitDir = Game.map.findExit(creep.room, anotherRoomName);
        var exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);
      } else {

      }
    }
};

module.exports = roleScout;
