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
      var spawn = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN)}})[0];
      var towerCritical=creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity*0.6)}});
      var tower=creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity*0.95)}});
      var spawnTar = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN) && (structure.energy < structure.energyCapacity)}});
      var extensions=spawn.pos.findInRange(FIND_MY_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION) && (structure.energy < structure.energyCapacity)}});
      extensions= _.sortBy(extensions, e => creep.pos.getRangeTo(e.pos));
      var centralStoragePri=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE) && (structure.store[RESOURCES_ALL] < 10000)}});
      var centralStorage=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE)}});
      var centralLink=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK) && (structure.energy < structure.energyCapacity)}});
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {  return (structure.structureType == STRUCTURE_CONTAINER)  }});

	     var target = []
      target = target.concat(towerCritical);
      target = target.concat(spawnTar);
      target = target.concat(extensions);
      target = target.concat(tower);
      target = target.concat(centralStoragePri);
      target = target.concat(centralLink);
      target = target.concat(centralStorage);
      target = target.concat(centralContainer);

      if (target[0].structureType==STRUCTURE_STORAGE) {
        for(var resourceType in creep.carry) {
            if (creep.transfer(target[0], resourceType) == ERR_NOT_IN_RANGE) {
              creep.moveTo(target[0]);
            }
          }
      } else if(creep.transfer(target[0], RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
          creep.moveTo(target[0]);
      }
    },

    deliverSourceToMainLinkFirst: function(creep) {
            var towerCritical=creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity*0.6)}});
      var spawn = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN)}})[0];
      var centralLink=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK) && (structure.energy < structure.energyCapacity)}});

      var tower=creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity*0.95)}});
      var spawnTar = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN) && (structure.energy < structure.energyCapacity)}});
      var extensions=spawn.pos.findInRange(FIND_MY_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION) && (structure.energy < structure.energyCapacity)}});
      extensions= _.sortBy(extensions, e => creep.pos.getRangeTo(e.pos));

       var target = []
       target = target.concat(towerCritical);
       target = target.concat(centralLink);

      target = target.concat(spawnTar);
      target = target.concat(extensions);
      target = target.concat(tower);


      if(creep.transfer(target[0], RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
          creep.moveTo(target[0]);
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
    haulFromCentralCotainers: function(creep) {
      var target = [];
      var spawn = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN)}})[0];
      var centralStorage=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE) }});
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER) }});
      target = target.concat(centralStorage);
      target = target.concat(centralContainer);
         if(creep.withdraw(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
           creep.moveTo(target[0]);
         }
    },
    getCentralStorage: function(spawn) {
      var target = [];
      var spawn = spawn.room.find(FIND_MY_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN)}})[0];
      var centralStorage=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE) }});
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER) }});
      target = target.concat(centralStorage);
      target = target.concat(centralContainer);
      if (target.length) {
        return target[0];
      } else {
        return false;
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

      var targetCrit = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: struct => ((struct.hits<struct.hitsMax*0.50 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART) || (struct.hits<creep.room.memory.wallHitsmin && (struct.structureType==STRUCTURE_WALL||struct.structureType==STRUCTURE_RAMPART)))});
      var targetsAll = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: struct => ((struct.hits<struct.hitsMax*0.50 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART) || (struct.hits<creep.room.memory.wallHitsmin && (struct.structureType==STRUCTURE_WALL||struct.structureType==STRUCTURE_RAMPART)))});

        if (targetCrit) {
          var idReturn = target.id;
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
      var target = [];
      var spawn = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN)}})[0];
      var centralStorage=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE) }});
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER) }});
      var anyContainer=creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER) }});

      target = target.concat(centralStorage);
      target = target.concat(centralContainer);
      target = target.concat(anyContainer);

         if(target.length > 0) {
             if(creep.withdraw(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(target[0]);
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
    pickupEnergy: function(creep) {
      var dropped = creep.pos.findInRange(FIND_DROPPED_ENERGY,1);
      if (dropped.length) {
        if(creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(dropped[0]);
        }
        return true;
      }
      return false;
    },

    pushFromLink: function(creep, linkController,linkCentral) {

        if(creep.withdraw(linkController, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(linkController);
        }
        linkCentral.transferEnergy(linkController);
    },



    harvestPrefered: function(creep) {
      var source = Game.getObjectById(creep.memory.pref)
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
      }
    },

    buildTarget: function(creep,target) {
          if(target!=null) {
              if(creep.build(target) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(target);
              }
          }

    }


};
module.exports = tasks;
