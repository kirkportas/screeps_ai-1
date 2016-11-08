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
        var droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY,{filter: (dropped) => {return (dropped.amount>=200)}});
        var droppedRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (droppedEnergy) {
          creep.say('fond e');
          if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedEnergy);
          } else if (droppedRes) {
            creep.say('fond r');
            if(creep.pickup(droppedRes) == ERR_NOT_IN_RANGE) {
              creep.moveTo(droppedRes);
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
