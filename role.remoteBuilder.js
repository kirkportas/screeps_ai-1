var tasks = require('tasks');
var roleRemotebuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

      if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

      if(creep.room.name != creep.memory.targetRoom) {
        var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
        var exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);
      } else {
        if(creep.memory.building) {
          var targetsAll = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
          if (targetsAll.length) {
              if(creep.build(targetsAll[0]) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(targetsAll[0]);
              }
            }
        } else {
          if (creep.memory.target===null || creep.memory.target===undefined) {
            creep.memory.target = tasks.findBiggestInRoom(creep,Game.rooms[creep.memory.targetRoom]);
          }
          //tasks.harvestPrefered(creep);
          tasks.harvestBiggestInRoom(creep,Game.rooms[creep.memory.targetRoom],creep.memory.target);
        }

      }
    }
  };

  module.exports = roleRemotebuilder;
