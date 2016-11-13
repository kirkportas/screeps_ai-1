var tasks = require('tasks');

var roleRemoteHarvester = {

    run: function(creep) {
      if(creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
      }
      if(!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
          creep.memory.delivering = true;
      }
      //var startRoom='E65S62';
      //var targetRoom='E65S61';

      //creep.memory.pref='57ef9eb986f108ae6e60fcd6';

      if(!creep.memory.delivering) {
        creep.say('1');
        if(creep.room.name != creep.memory.targetRoom) {
          var res = creep.moveTo(Game.getObjectById(creep.memory.pref));
          if (res == ERR_INVALID_TARGET||res==ERR_NO_PATH) {
            var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
          }
        } else {
          tasks.harvestPrefered(creep);
        }
      } else {
        var homeSpawn=Game.rooms[creep.memory.homeRoom].find(FIND_MY_SPAWNS)[0];
        creep.say('2');
        if(creep.room.name != creep.memory.homeRoom) {
          var res = creep.moveTo(homeSpawn) ;
          if (res == ERR_INVALID_TARGET||res==ERR_NO_PATH) {
            var exitDir = Game.map.findExit(creep.room, creep.memory.homeRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
          }

        } else {
          var containers = Game.rooms[creep.memory.homeRoom].find(FIND_MY_STRUCTURES);
          var centralContainer=homeSpawn.pos.findInRange(FIND_STRUCTURES,8, {
                          filter: (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE)
                        }})[0];
          if (centralContainer) {
          if(creep.transfer(centralContainer, RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
              creep.moveTo(centralContainer);
            }
          } else if (containers.length) {
            if(creep.transfer(containers[0], RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[0]);
              }
          }
        }


      }


    }
};

module.exports = roleRemoteHarvester;
