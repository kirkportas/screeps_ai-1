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
        var extracter=Game.getObjectById(creep.memory.extracter);
        if (creep.harvest(extracter) == ERR_NOT_IN_RANGE) {
          creep.moveTo(extracter)
        }
      } else {


      }
	}
};

module.exports = roleExtracter;
