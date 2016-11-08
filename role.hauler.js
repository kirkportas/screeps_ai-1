var tasks = require('tasks');
var roleHauler = {

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
        tasks.deliverSourceToMain(creep);
	    } else {

        var dropped = creep.pos.findInRange(FIND_DROPPED_ENERGY,5,{filter: (dropped) => {return (dropped.amount>=100)}});
        //var droppedRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (dropped) {
          creep.say('fond e');
          if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
            creep.moveTo(dropped);
          }
        } else {
          if (creep.memory.targetContainer===null || creep.memory.targetContainer===undefined) {
            creep.memory.targetContainer= tasks.findContainerDedicatedBiggest(creep);
          }
            tasks.withdrawFromId(creep,creep.memory.targetContainer.id);
          }
	    }
	}
};

module.exports = roleHauler;
