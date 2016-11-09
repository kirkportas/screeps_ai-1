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


        var dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if (dropped!=null && (creep.pos.getRangeTo(dropped)<5 || (creep.pos.getRangeTo(dropped)<10 && creep.memory.pickup))) {
          Game.flags.Flag1.setPosition( dropped.pos );
          creep.memory.pickup = true;
          creep.say('d: '+creep.pos.getRangeTo(dropped));
          if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
            creep.moveTo(dropped);
          }
        } else {
          creep.memory.pickup = false;
          if (creep.memory.targetContainer===null || creep.memory.targetContainer===undefined) {
            creep.memory.targetContainer= tasks.findContainerDedicatedBiggest(creep);
          }
            tasks.withdrawFromId(creep,creep.memory.targetContainer.id);
          }
	    }
	}
};

module.exports = roleHauler;
