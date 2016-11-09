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
        //creep.say('1');
        tasks.deliverSourceToMain(creep);
	    } else {


        var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (dropped!=null && creep.pos.getRangeTo(dropped)<2) {
          creep.say('d: '+creep.pos.getRangeTo(dropped));
          if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
            creep.moveTo(dropped);
          }
        } else {
          //creep.say('2');
          if (creep.memory.targetContainer===null || creep.memory.targetContainer===undefined) {
            creep.memory.targetContainer= tasks.findContainerDedicatedBiggest(creep);
          }
            tasks.withdrawFromId(creep,creep.memory.targetContainer.id);
          }
	    }
	}
};

module.exports = roleHauler;
