var tasks = require('tasks');
var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.room.name != creep.memory.targetRoom) {
        var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
        var exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);
      } else {
        var needTarget=true;
        var targetHostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var targetStructure = creep.pos.findClosestByPath(FIND_STRUCTURES);
        var targetConstructionsites = creep.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES);

        creep.say(targetStructure);
        if (targetHostile&&needTarget) {
          if(creep.attack(targetHostile) == ERR_NOT_IN_RANGE) {
            if (creep.moveTo(targetHostile) != ERR_NO_PATH) {
              needTarget=false;
            };
          }
        }
        if (targetStructure&&needTarget) {
          if(creep.attack(targetStructure) == ERR_NOT_IN_RANGE) {
            var res = creep.moveTo(targetStructure);
            if (res != ERR_NO_PATH) {
              needTarget=false;
            };
          }
        }

        if (targetConstructionsites&&needTarget) {
          if(creep.attack(targetConstructionsites) == ERR_NOT_IN_RANGE) {
            if (creep.moveTo(targetConstructionsites) != ERR_NO_PATH) {
              needTarget=false;
            };
          }
        }
      }
    }
  };

  module.exports = roleAttacker;
