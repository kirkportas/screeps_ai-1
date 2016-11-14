var tasks = {

    scoutRoom: function(creep) {
      if (creep.room.name == creep.memory.targetRoom && Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom]) {
        let timeSinceLastScout = Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].timeSinceLastScout;
        let timeSinceLastFullScout = Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].timeSinceLastFullScout;
        if (timeSinceLastScout>=5 || timeSinceLastScout==-1) {
          var sources= creep.room.find(FIND_SOURCES);
          Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].sources={}
          for (var i = 0; i < sources.length; i++) {
            Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].sources[sources[i].id]={pos: sources[i].pos}
          }

          var myConstructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
          var allStructures = creep.room.find(FIND_STRUCTURES);
          var damagedBuildings = 0;

          _.forEach(allStructures, function(struc){
            if (struc.hitsMax!==undefined && struc.hits<struc.hitsMax*0.5) {
              damagedBuildings++;
            }
          });

          Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].myConstructionSites=myConstructionSites.length;
          Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].myDamagedStructures=damagedBuildings;

          var hostiles=creep.room.find(FIND_HOSTILE_CREEPS);
          var npcInvadersWeak=0;
          var hostileStruc=creep.room.find(FIND_HOSTILE_STRUCTURES);
          _.forEach(hostiles, function(creep){
            if (creep.owner.username=='Invader' && creep.body.length<=16) npcInvadersWeak++;
          });

          if (hostileStruc.length) {
            Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].danger=10;
          } else if (hostiles.lenght-npcInvadersWeak>0){
            Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].danger=10;
          } else if (npcInvadersWeak>=1) {
            Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].danger=1;
          } else {
            Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].danger=0;
          }


          var controller = creep.room.controller;
          var reservation = controller.reservation;
          if (reservation) {
            if (reservation.username=='vestad') {
              Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].reservation=reservation.ticksToEnd;
            } else {
              Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].reservation=-1;
            }
          } else {
            Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].reservation=0;
          }
          Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].timeSinceLastScout=0;

        }
        if (!timeSinceLastFullScout || timeSinceLastFullScout>=300 || timeSinceLastFullScout==-1) {
          var scout =Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom];
          var spawn= Game.rooms[creep.memory.homeRoom].find(FIND_MY_SPAWNS)[0];
          if (spawn) {
            for (var source in scout.sources) {
              var path = new PathFinder.search(spawn.pos,{pos:Game.getObjectById(scout.sources[source]).pos,range:1},{plainCost: 1,swampCost: 1});
              if (path) {
              }
            }
          }

          //CODE
          Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].timeSinceLastFullScout=0;

        }



      }
    },

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

      var targetCrit = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: struct => ((struct.hits<struct.hitsMax*0.25 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART) || (struct.hits<creep.room.memory.wallHitsmin/2 && (struct.structureType==STRUCTURE_WALL||struct.structureType==STRUCTURE_RAMPART)))});
      var targetsAll = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: struct => ((struct.hits<struct.hitsMax*0.50 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART) || (struct.hits<creep.room.memory.wallHitsmin && (struct.structureType==STRUCTURE_WALL||struct.structureType==STRUCTURE_RAMPART)))});

        if (targetCrit) {
          return targetCrit.id;
        } else if (targetsAll) {
          return targetsAll.id;
        } else return null;
    },
    findStructureToRepairIdle: function(creep) {
      //if((struct.hits<struct.hitsMax*0.75 && struct.structureType!=STRUCTURE_WALL) || (struct.hits<struct.hitsMax*0.01 && struct.structureType==STRUCTURE_WALL))
      var targets = creep.room.find(FIND_STRUCTURES, {
         filter: struct => (struct.hits<struct.hitsMax*0.9 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART)
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
      if (!spawn) return false;
      var centralStorage=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY]>=creep.carryCapacity) }});
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY]>=creep.carryCapacity)  }});
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
    findClosestInRoom: function(creep,room) {
      var sources = creep.pos.findClosestByRange(FIND_SOURCES);
      if (sources) {return sources.id;} else {return null;}
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
