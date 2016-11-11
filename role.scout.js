var tasks = require('tasks');
var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.room.name != creep.memory.targetRoom) {
        var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
        var exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);
      } else {
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES);
        var res = creep.moveTo(target);
        //var res = creep.moveTo(Game.rooms[creep.memory.targetRoom].controller);
        creep.say(res);
      }
    }
  }

  module.exports = roleScout;
