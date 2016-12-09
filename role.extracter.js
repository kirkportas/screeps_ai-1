var tasks = require('tasks');

Creep.prototype.runExtracter = function(creep) {
      if(creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
      }
      if(!creep.memory.delivering && _.sum(creep.carry) == creep.carryCapacity) {
          creep.memory.delivering = true;
      }

    if (!creep.memory.delivering) {
      var mineral=Game.getObjectById(creep.memory.mineral);
      if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
        creep.moveTo(mineral)
      }
    } else {
      var terminal = creep.room.terminal;
      for(var resourceType in creep.carry) {
        if(creep.transfer(terminal, resourceType)== ERR_NOT_IN_RANGE) {
            creep.moveTo(terminal);
        }
      }

    }
}
