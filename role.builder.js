var tasks = require('tasks');
var roleBuilder = {

  findBuild: function(creep) {
    creep.say('r')
  },
  findRepair: function(creep) {
    creep.say('r')
  },

  run: function(creep) {

    if(creep.memory.building && creep.carry.energy == 0) {
          creep.memory.building = false;
          creep.memory.targetFix = null;
          creep.memory.targetBuild = null;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
    }

    if (creep.memory.building) {
      if (creep.memory.targetFix) { roleBuilder.repairTarget(creep))
      } else if (creep.memory.targetBuild) { roleBuilder.buildTarget(creep))
      } else if (findBuild()) {

      } else if (findRepair()) {

      }

    } else {
      tasks.haulFromContainerAny(creep);
    }
  }

	}
};

module.exports = roleBuilder;
