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
          if (!tasks.pickupEnergy(Creep)) {
            tasks.haulFromCentralCotainers(creep);
          }

      }
	}
};

module.exports = roleUpgrader;
