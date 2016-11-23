var tasks = require('tasks');
var roleBuilder = {

  findBuild: function(creep) {
    var targetsAll = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    creep.say('r')
  },
  findRepair: function(creep) {
    creep.say('r')
  },
  repairTarget: function(creep) {
    var target = Game.getObjectById(creep.memory.targetFix);
    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
  },
  buildTarget: function(creep) {
    var target = Game.getObjectById(creep.memory.targetBuild);
    if(creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
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
      if (creep.memory.targetFix) { roleBuilder.repairTarget(creep)
      } else if (creep.memory.targetBuild) { roleBuilder.buildTarget(creep)
      } else if (findBuild()) {

      } else if (findRepair()) {

      }

    } else {
      tasks.haulFromContainerAny(creep);
    }
  }
};

module.exports = roleBuilder;
