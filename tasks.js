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
      //try {
      var target=[];
      var spawn = creep.room.find(FIND_MY_STRUCTURES, {
                      filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN)
                    }})[0];

      var tower=creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                      filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity)
                    }});
      var spawnTar = creep.room.find(FIND_MY_STRUCTURES, {
                      filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN) && (structure.energy < structure.energyCapacity)
                    }});
      var extensions=spawn.pos.findInRange(FIND_MY_STRUCTURES,8, {
                      filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION) && (structure.energy < structure.energyCapacity)
                    }});
      var centralStorage=spawn.pos.findInRange(FIND_STRUCTURES,8, {
                      filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE)
                    }});
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,8, {
                      filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER)
                    }});

      extensions= _.sortBy(extensions, e => creep.pos.getRangeTo(e.pos));
      target = target.concat(tower);
      target = target.concat(spawnTar);
      target = target.concat(extensions);
      target = target.concat(centralContainer);
      console.log(target.length,'  ',target[0])
      if(creep.transfer(target[0], RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
          creep.moveTo(target[0]);
      }
    //} catch(err) {console.console.error('err');}
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
    haulFromCentralCotainers: function(creep) {
      var spawn = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN)}})[0];
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,5, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER) }})[0];

      //targets = _.sortBy(targets, s => -s.energy);
         if(creep.withdraw(centralContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
           creep.moveTo(centralContainer);
         }
    },
    findContainerDedicatedBiggest: function(creep) {
      var spawn = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN)}})[0];
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,5, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER) }})[0];
      var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return ( structure.structureType == STRUCTURE_CONTAINER
                             ) && (structure.structureType == STRUCTURE_CONTAINER); } });

      var index = targets.indexOf(centralContainer);
      if(index != -1) targets.splice( index, 1 );

      targets = _.sortBy(targets, s => -s.store[RESOURCE_ENERGY]);
      //console.log(targets[0]);
      return targets[0];
    },
    findStructureToRepair: function(creep) {
      //if((struct.hits<struct.hitsMax*0.75 && struct.structureType!=STRUCTURE_WALL) || (struct.hits<struct.hitsMax*0.01 && struct.structureType==STRUCTURE_WALL))
      var targets = creep.room.find(FIND_STRUCTURES, {
         filter: struct => ((struct.hits<struct.hitsMax*0.50 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART) || (struct.hits<creep.room.memory.wallHitsmin && (struct.structureType==STRUCTURE_WALL||struct.structureType==STRUCTURE_RAMPART)))
        });
        targets.sort((a,b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
        if (targets.length) {
          var idReturn = targets[0].id;
          return idReturn;
        } else return null;
    },
    findStructureToRepairIdle: function(creep) {
      //if((struct.hits<struct.hitsMax*0.75 && struct.structureType!=STRUCTURE_WALL) || (struct.hits<struct.hitsMax*0.01 && struct.structureType==STRUCTURE_WALL))
      var targets = creep.room.find(FIND_STRUCTURES, {
         filter: struct => (struct.hits<struct.hitsMax && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART)
        });
        targets.sort((a,b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
        if (targets.length) {
          var idReturn = targets[0].id;
          return idReturn;
        } else return null;
    },

    withdrawFromId: function(creep,targetId) {
      if(creep.withdraw(Game.getObjectById(targetId), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.getObjectById(targetId));
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
      var sources = creep.pos.findClosestByRange(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0]);
      }
    },

    findBiggestInRoom: function(creep,room) {
      var sources = room.find(FIND_SOURCES);
      sources=_.sortBy(sources, s => -s.energy)
      if (sources.length) {return sources[0].id;} else {return null;}
    },

    harvestBiggestInRoom: function(creep,room,target) {
      var object = Game.getObjectById(target);
      if(creep.harvest(object) == ERR_NOT_IN_RANGE) {
          creep.moveTo(object);
      }
    },



    harvestPrefered: function(creep) {
      var source = Game.getObjectById(creep.memory.pref)
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
      } else if (creep.harvest(source)== -7) {
        var route = Game.map.findRoute(creep.room, Game.flags['Flag1'].room);
        if(route.length > 0) {
          console.log('Now heading to room '+route[0].room);
          var exit = creep.pos.findClosestByRange(route[0].exit);
          creep.moveTo(exit);
        }
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
