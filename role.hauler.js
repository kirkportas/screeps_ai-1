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

        var droppedEne = creep.pos.findInRange(FIND_DROPPED_ENERGY,5);
        var droppedRes = creep.pos.findInRange(FIND_DROPPED_RESOURCES,5);
        var dropped = droppedRes.concat(droppedEne);
        //var droppedRes = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (dropped.length>0) {
          creep.say(dropped.length);
          if(creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(dropped[0]);
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
