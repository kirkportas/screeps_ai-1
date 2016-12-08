var tasks = require('tasks');
var roleSpawnhauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.delivering && creep.carry.energy < 50) {
            creep.memory.delivering = false;
	    }
	    if(!creep.memory.delivering &&  _.sum(creep.carry) == creep.carryCapacity) {
          creep.memory.targetContainer= null;
	        creep.memory.delivering = true;
	    }

	    if(creep.memory.delivering) {
        tasks.deliverSourceToMainLinkFirst(creep);
	    } else {
        var dropped = creep.pos.findInRange(FIND_DROPPED_RESOURCES,10,{filter:(dropped)=>{return dropped.amount>200}});
        if (dropped.length) {
          creep.memory.targetDropped=dropped[0];
          creep.say('d: '+creep.pos.getRangeTo(dropped[0]));
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
