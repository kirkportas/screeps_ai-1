var tasks = require('tasks');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.carry.energy >= creep.carryCapacity*0.8) { //80% i tilfelle de finner mistet
	        creep.memory.upgrading = true;
	    }

      // OPPGRADERINGSMODUS
	    if(creep.memory.upgrading) {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
      }
      //HENTEMODUS
      if(!creep.memory.upgrading) {
        if (!tasks.pickupEnergy(creep)) {
          var spawn = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN)}})[0];
          var linkCentral=null;
          var linkController=null;
          if (creep.room.storage) {
            linkCentral=creep.room.storage.pos.findInRange(FIND_MY_STRUCTURES,3, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK)}})[0];
            linkController=creep.room.controller.pos.findInRange(FIND_MY_STRUCTURES,3, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK)}})[0];
          }

          if (creep.room.storage&&linkCentral&&linkController) {
            if(creep.withdraw(linkController, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(linkController);
            }
          } else {
            tasks.haulFromCentralCotainers(creep);
          }
        }

      }
	}
};

module.exports = roleUpgrader;
