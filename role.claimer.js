var tasks = require('tasks');
Creep.prototype.runClaimer = function(creep) {
      if(creep.room.name != creep.memory.targetRoom) {
        var res=null;
        if (Game.rooms[creep.memory.targetRoom]) {
          res = creep.moveTo(Game.rooms[creep.memory.targetRoom].controller);
        }
        if (res == ERR_INVALID_TARGET||res==ERR_NO_PATH||res==null) {
          var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
          var exit = creep.pos.findClosestByRange(exitDir);
          creep.moveTo(exit);
        }
      } else {
        if (creep.memory.takeOver) {
          creep.say('takeover')
          if (creep.claimController(Game.rooms[creep.memory.targetRoom].controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.rooms[creep.memory.targetRoom].controller);
          }
        }
        if (creep.reserveController(Game.rooms[creep.memory.targetRoom].controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(Game.rooms[creep.memory.targetRoom].controller);
        }

      }
    }
