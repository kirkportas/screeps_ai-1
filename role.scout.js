var tasks = require('tasks');
var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.room.name != creep.memory.targetRoom) {
        var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
        var exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);
      } else {
        Memory.test2=creep.memory.homeRoom;
        //if (creep.memory.homeRoom.memory.scout[creep.memory.targetRoom]) {
          console.log('exists');

        //}

        if (creep.moveTo(Game.rooms[creep.memory.targetRoom].controller) == ERR_NO_PATH) {
          var target = creep.pos.findClosestByRange(FIND_STRUCTURES);
          var res = creep.moveTo(target);
          creep.say(res);
        }

      }
    }
  };

  module.exports = roleScout;
