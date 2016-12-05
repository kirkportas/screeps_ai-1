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

        var extractor=Game.getObjectById(creep.memory.extractor);
        creep.say(creep.harvest(extractor))
        if (creep.harvest(extractor) == ERR_NOT_IN_RANGE) {
          creep.moveTo(extractor)
        }
      } else {


      }
	}
};

module.exports = roleExtracter;
