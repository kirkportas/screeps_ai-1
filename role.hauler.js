var tasks = require('tasks');
var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('getting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('delivering');
	    }

	    if(creep.memory.building) {
        tasks.haulFromDedicatedCotainers(creep);
	    } else {
        tasks.deliverSourceToMain(creep);
	    }
	}
};

module.exports = roleHauler;
