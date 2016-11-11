var tasks = require('tasks');
var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.room.name != creep.memory.targetRoom) {
        var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
        var exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);
      } else {

        var targetHostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var targetStructure = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                filter: (structure) => {
                    return (structure.structureType != STRUCTURE_CONTROLLER)
                }
        });
        var targetConstructionsites = creep.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES);
        creep.say(targetStructure);

        if (targetHostile) {
          if(creep.attack(targetHostile) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targetHostile)
          }
        } else if (targetStructure) {
          if(creep.attack(targetStructure) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targetStructure)
          }
        } else if (targetConstructionsites) {
          creep.moveTo(targetConstructionsites);
        }
      }
    }
  };

  module.exports = roleAttacker;
