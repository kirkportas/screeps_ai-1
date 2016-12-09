var tasks = require('tasks');
var prototypeCreep = require('prototype.creep');

Creep.prototype.runRemoteHarvester = function(creep) {
      if(creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
      }
      if((!creep.memory.delivering &&  _.sum(creep.carry) == creep.carryCapacity)) {
          creep.memory.delivering = true;
      }



      if(!creep.memory.delivering) {
        var source = Game.getObjectById(creep.memory.pref)
        var result = creep.harvest(source)
        if( source==null || result == ERR_NOT_IN_RANGE ) {
            creep.moveToOpt(new RoomPosition(creep.memory.prefPos.x,creep.memory.prefPos.y,creep.memory.prefPos.roomName));
        }
      } else {
        var container = creep.pos.findInRange(FIND_STRUCTURES,2,{ filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER )  } })[0];
        var centralStorage=Game.rooms[creep.memory.homeRoom].storage;
        if (container) {
          if (container.hits<container.hitsMax) {
            creep.repair(container);
          } else {
            var result=creep.transfer(container, RESOURCE_ENERGY);
            if(result == ERR_NOT_IN_RANGE) {
              creep.moveTo(container);
            } else if (result == ERR_FULL) {
              creep.drop(RESOURCE_ENERGY);
            }
          }
        } else {
          var constructionSites=creep.pos.findInRange(FIND_CONSTRUCTION_SITES,3);
          if (constructionSites.length) {
            creep.moveTo(constructionSites[0])
            creep.build(constructionSites[0]);
          } else if (centralStorage) {
          if(creep.transfer(centralStorage, RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
              creep.moveToOpt(centralStorage);
          }
        }
      }

      }


};
