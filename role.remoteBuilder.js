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
          var targetsAll = creep.room.find(FIND_CONSTRUCTION_SITES);
          if (targetsAll.length) {
              if(creep.build(targetsAll[0]) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(targetsAll[0]);
              }
            }
        } else {
          tasks.harvestClosest(creep);
        }

      }
    }
  };

  module.exports = roleRemotebuilder;
