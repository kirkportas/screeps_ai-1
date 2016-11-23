var tasks = require('tasks');
var roleBuilder = {

  findBuild: function(creep) {
    var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (target) {
      creep.memory.targetBuild=target.id;
      return true;
    } else {
      return false;
    }
    return false;
  },
  findRepair: function(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
       filter: struct => (struct.hits<struct.hitsMax*0.5 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART)
      });
      if (target) {
        creep.memory.targetFix=target.id;
        return true;
      } else {
        return false;
      }
  },
  repairTarget: function(creep) {
    var target = Game.getObjectById(creep.memory.targetFix);
    if (target==null || target.hits==target.hitsMax); //
    creep.say(target)
    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
    return true;
  },
  buildTarget: function(creep) {
    var target = Game.getObjectById(creep.memory.targetBuild);
    if (target==null) {creep.memory.targetBuild=null;return false;}
    if(creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
    return true;
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
      if (creep.memory.targetFix!==null) { roleBuilder.repairTarget(creep) //
      } else if (creep.memory.targetBuild!==null && creep.memory.targetBuild!==undefined) { roleBuilder.buildTarget(creep)
      } else if (roleBuilder.findBuild(creep)) {

      } else if (roleBuilder.findRepair(creep)) {

      }

    } else {
      tasks.haulFromContainerAny(creep);
    }
  }
};

module.exports = roleBuilder;
