var tasks = require('tasks');
var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.room.name != creep.memory.targetRoom) {
        var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
        var exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);
      } else {
        var controllerId = Game.rooms[creep.memory.targetRoom].controller.id;
        console.log(controllerId);
        var controller = Game.getObjectById(controllerId);
        /*
        if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller);
        }  */
        if (creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(controller);
        }

      }
    }
  };

  module.exports = roleClaimer;
