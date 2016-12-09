var tasks = require('tasks');
Creep.prototype.runBuilder = function(creep) {

  var findBuildCritical =  function(creep) {
    var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES,{filter: struct => (struct.structureType==STRUCTURE_WALL || struct.structureType==STRUCTURE_RAMPART|| struct.structureType==STRUCTURE_LINK||struct.structureType==STRUCTURE_CONTAINER)});
    if (target) {
      creep.memory.targetBuild=target.id;
      return true;
    }
    return false;
  },

  var findBuild =  function(creep) {
    var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (target) {
      creep.memory.targetBuild=target.id;
      return true;
    }
    return false;
  },
  var findRepair= function(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
       filter: struct => ((struct.hits<struct.hitsMax*0.75 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART)||(struct.hits<Math.min(struct.hitsMax,creep.room.memory.wallHitsMax*0.5) && (struct.structureType==STRUCTURE_WALL||struct.structureType==STRUCTURE_RAMPART)))
      });
      if (target) {
        creep.memory.targetFix=target.id;
        repairTarget(creep);
        return true;
      }
      return false;
  },
  var findRepairIdle= function(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
       filter: struct => ((struct.hits<struct.hitsMax && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART)||(struct.hits<Math.min(struct.hitsMax,creep.room.memory.wallHitsMax)  && (struct.structureType==STRUCTURE_WALL||struct.structureType==STRUCTURE_RAMPART)))
      });
      if (target) {
        creep.memory.targetFix=target.id;
        repairTarget(creep);
        return true;
      }
      return false;
  },
  var findRepairCritical= function(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
       filter: struct => ((struct.hits<struct.hitsMax*0.50 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART)||(struct.hits<Math.min(struct.hitsMax,creep.room.memory.wallHitsMin) && (struct.structureType==STRUCTURE_WALL||struct.structureType==STRUCTURE_RAMPART)))
      });
      if (target) {
        creep.memory.targetFix=target.id;
        repairTarget(creep);
        return true;
      }
      return false;
  },
  var repairTarget= function(creep) {
    var target = Game.getObjectById(creep.memory.targetFix);
    if (target==null || target.hits==target.hitsMax)  {creep.memory.targetFix=null;return false;}
    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
    return true;
  },
  var buildTarget= function(creep) {
    var target = Game.getObjectById(creep.memory.targetBuild);
    if (target==null) {creep.memory.targetBuild=null;return false;}
    if(creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
    return true;
  },
    if(creep.memory.building && creep.carry.energy == 0) {
          creep.memory.building = false;
          creep.memory.targetFix = null;
          creep.memory.targetBuild = null;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
    }

    if (creep.memory.building) {
      if (creep.memory.targetFix!==null) { repairTarget(creep)//
      } else if (creep.memory.targetBuild!==null && creep.memory.targetBuild!==undefined) { buildTarget(creep)

      } else if (findBuildCritical(creep)) {
      } else if (findRepairCritical(creep)) {
      } else if (findRepair(creep)) {
      } else if (findBuild(creep)) {
      } else if (findRepairIdle(creep)) {

      }

    } else {
      tasks.haulFromContainerAny(creep);
    }
  }
