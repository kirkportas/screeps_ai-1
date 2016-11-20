var tasks = require('tasks');
var roleAttacker = {

    attack: function(creep) {
      var targetHostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS,{ filter: function(c) { return (c.getActiveBodyparts(ATTACK)+c.getActiveBodyparts(RANGED_ATTACK)>0)}});
      var targetHostileSec = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      var targetStructurePri = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter: (structure) => {return (structure.structureType != STRUCTURE_CONTROLLER && structure.structureType != STRUCTURE_WALL &&structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_ROAD)}});
      var targetStructure = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter: (structure) => {return (structure.structureType != STRUCTURE_CONTROLLER && structure.structureType != STRUCTURE_ROAD)}});
      var targetConstructionsites = creep.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES);

      if (targetHostile) {
        if(creep.attack(targetHostile) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targetHostile)
        }
      } else if (targetStructurePri) {
        if(creep.attack(targetStructurePri) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targetStructurePri,{avoid:creep.room.find(FIND_EXIT)})
        }
      } else if (targetStructure) {
        if(creep.attack(targetStructure) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targetStructure)
        }
      } else if (targetConstructionsites) {
        creep.moveTo(targetConstructionsites);
      } else if (targetHostileSec) {
        if(creep.attack(targetHostileSec) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targetHostileSec)
        }
      } else return false;
      return true;

    },
    heal: function(creep) {
      var findCloseFriends = creep.pos.findInRange(FIND_MY_CREEPS,5,{ filter: function(object) { return object.hits < object.hitsMax; }});
      if (findCloseFriends.length) {
        if(creep.heal(findCloseFriends[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(findCloseFriends[0]);
        } else if (targetStructure) {
          creep.moveTo(targetStructure)
        }
        return true;
      }
      return false;
    },

    run: function(creep) {
      if (creep.memory.flag && (!Game.flags[creep.memory.flag].room || creep.room.name!=Game.flags[creep.memory.flag].room.name)) {
        creep.moveTo(Game.flags[creep.memory.flag]);
      } else if(!creep.memory.flag && creep.room.name != creep.memory.targetRoom) {
        var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
        var exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);
      } else {
        findCloseFriends=_.sortBy(findCloseFriends, creep => (creep.hits/creep.hitsMax));
        if (creep.getActiveBodyparts(HEAL)>0 && roleAttacker.heal(creep)) {
        } else if (creep.getActiveBodyparts(ATTACK)>0 && roleAttacker.attack(creep)) {
        } else if (creep.memory.fleeAfter==true) {
          creep.say('suicide')
          creep.memory.role='suicide'
        } else if (creep.memory.flag){
          creep.moveTo(Game.flags[creep.memory.flag]);
        } else {
          creep.moveTo(creep.room.controller);
        }
      }
    }
  };

  module.exports = roleAttacker;
