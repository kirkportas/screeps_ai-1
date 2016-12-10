var tasks = require('tasks');
var prototypeCreep = require('prototype.creep');
Creep.prototype.runScout = function(creep) {
    if(creep.room.name != creep.memory.targetRoom) {
      if (creep.memory.targetExit) {
        creep.moveToOpt(Game.getObjectById(creep.memory.targetExit));
      } else {
        var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
        creep.memory.targetExit = creep.pos.findClosestByRange(exitDir);
        creep.moveToOpt(Game.getObjectById(creep.memory.targetExit));
      }
    } else {

      if (creep.moveTo(Game.rooms[creep.memory.targetRoom].controller) == ERR_NO_PATH) {
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES);
        var res = creep.moveToOpt(target);
      }

    }
  }
