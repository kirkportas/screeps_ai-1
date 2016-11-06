var tasks = require('tasks');
var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
	    }
	    if(!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
          creep.memory.targetContainer= null;
	        creep.memory.delivering = true;
	    }

	    if(creep.memory.delivering) {
        tasks.deliverSourceToMain(creep);
	    } else {
        if (creep.memory.targetContainer===null) {
          creep.memory.targetContainer= tasks.findContainerDedicatedBiggest(creep);
        }
          tasks.withdrawFromId(creep,Game.getObjectById(creep.memory.targetContainer));
	    }
	}
};

module.exports = roleHauler;
