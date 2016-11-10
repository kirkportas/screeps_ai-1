var tasks = require('tasks');
var roleSpawnhauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
	    }
	    if(!creep.memory.delivering &&  _.sum(creep.carry) == creep.carryCapacity) {
          creep.memory.targetContainer= null;
	        creep.memory.delivering = true;
	    }

	    if(creep.memory.delivering) {
        tasks.deliverSourceToMainLinkFirst(creep);
	    } else {


        var dropped = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1);
        if (dropped.length) {
          creep.say('d: '+creep.pos.getRangeTo(dropped));
          if(creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(dropped[0]);
          }
        } else {
            tasks.haulFromCentralCotainers(creep);
          }
	    }
	}
};

module.exports = roleSpawnhauler;