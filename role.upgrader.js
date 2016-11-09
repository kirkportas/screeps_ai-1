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

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
          var dropped = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
          if (dropped!=null && creep.pos.getRangeTo(dropped)<2) {
            creep.say('d: '+creep.pos.getRangeTo(dropped));
            if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
              creep.moveTo(dropped);
            }
          } else {
          tasks.haulFromCentralCotainers(creep);
        }
        }
	}
};

module.exports = roleUpgrader;
