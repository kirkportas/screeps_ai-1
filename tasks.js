var tasks = {

    deliverSource: function(creep) {
      var targets = creep.room.find(FIND_STRUCTURES, {
              filter: (structure) => {
                  return (
                      structure.structureType == STRUCTURE_CONTAINER ||
                      structure.structureType == STRUCTURE_EXTENSION ||
                      structure.structureType == STRUCTURE_SPAWN ||
                      structure.structureType == STRUCTURE_TOWER
                          ) && (structure.energy < structure.energyCapacity) || (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
              }
      });
      targets=_.sortBy(targets, s => creep.pos.getRangeTo(s))
      if(targets.length > 0) {
          if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[0]);
          }
      }
    },
    deliverSourceDedicated: function(creep,target) {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    },
    deliverSourceToMain: function(creep) {
      var target=null;
      var spawn = creep.room.find(FIND_MY_STRUCTURES, {
                      filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN)
                    }})[0];
      var extensions=spawn.pos.findInRange(FIND_MY_STRUCTURES,5, {
                      filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION) && (structure.energy < structure.energyCapacity)
                    }});
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,5, {
                      filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER)
                    }})[0];
      if (spawn.energy < spawn.energyCapacity) {
        target=spawn;
      } else if (extensions.length>0) {
        target=extensions[0];
      } else if (centralContainer!=null) {
        target = centralContainer;
      } else {
        target=spawn;
      }
      if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
      }
    },

    haulFromDedicatedCotainers: function(creep) {
      var spawn = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN)}})[0];
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,5, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER) }})[0];
      var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return ( structure.structureType == STRUCTURE_CONTAINER
                             ) && (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 50); } });

      var index = targets.indexOf(centralContainer);
      if(index != -1) targets.splice( index, 1 );

      //targets = _.sortBy(targets, s => -s.energy);
     if(targets.length > 0) {
         if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
           creep.moveTo(targets[0]);
         }
     }
    },
    findContainerDedicatedBiggest: function(creep) {
      var spawn = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN)}})[0];
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,5, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER) }})[0];
      var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return ( structure.structureType == STRUCTURE_CONTAINER
                             ) && (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 50); } });

      var index = targets.indexOf(centralContainer);
      if(index != -1) targets.splice( index, 1 );

      targets = _.sortBy(targets, s => -s.energy);
      console.log(targets[0]);
      return targets[0];
    },

    withdrawFromId: function(creep,id) {
      if(creep.withdraw(id, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(id);
      }
    },

    haulFromContainerAny: function(creep) {

      var targets = creep.room.find(FIND_STRUCTURES, {
                 filter: (structure) => {
                     return (
                         structure.structureType == STRUCTURE_CONTAINER
                             ) && (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 50);
                 }
         });
        targets =  _.sortBy(targets, s => creep.pos.getRangeTo(s))
         if(targets.length > 0) {
             if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(targets[0]);
             }
           }

    },

  checkSourceNeeded: function(creep) {
    var targets = creep.room.find(FIND_MY_STRUCTURES, {
      filter: (structure) => {
      return (
          structure.structureType == STRUCTURE_SPAWN
              ) && (structure.energy < structure.energyCapacity);
            }
    });
    if (targets.length>0) {
      return true;
    } else {
      return false;
    }
    },

    harvestClosest: function(creep) {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0]);
      }
    },

    harvestPrefered: function(creep) {
      var source = Game.getObjectById(creep.memory.pref)
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
      }
    },
    buildContainer: function(creep,target) {
      /*
      var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
                  filter: (structure) => {
                      return (structure.structureType == STRUCTURE_CONTAINER);
                  }
          });
          */
          if(target!=null) {
              if(creep.build(target) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(target);
              }
          }

    }


};
module.exports = tasks;
