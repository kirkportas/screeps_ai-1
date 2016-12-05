var tasks = require('tasks');

var roleExtracter = {

    /** @param {Creep} creep **/
    run: function(creep) {


        if(creep.memory.delivering && creep.carry.energy == 0) {
              creep.memory.delivering = false;
        }
        if(!creep.memory.delivering && creep.carry.energy ==creep.carryCapacity) {
            creep.memory.delivering = true;
        }

	    if(!creep.memory.delivering) {

        var mineral=Game.getObjectById(creep.memory.mineral);
        creep.say(creep.harvest(mineral))
        if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
          creep.moveTo(mineral)
        }
      } else {


      }
	}
};

module.exports = roleExtracter;
