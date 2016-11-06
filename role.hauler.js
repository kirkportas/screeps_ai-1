var tasks = require('tasks');
var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
	    }
	    if(!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
        creep.say('reset');
          creep.memory.targetContainer= null;
	        creep.memory.delivering = true;
	    }

	    if(creep.memory.delivering) {
        tasks.deliverSourceToMain(creep);
        //creep.say('del');
	    } else {
        //tasks.haulFromDedicatedCotainers(creep);
        if (creep.memory.targetContainer===null) {
          //creep.say('new');
          creep.memory.target= tasks.findContainerDedicatedBiggest(creep);
        }
          tasks.withdrawFromId(creep,creep.memory.target);
          //console.log(creep.memory.target);
	    }
	}
};

module.exports = roleHauler;
