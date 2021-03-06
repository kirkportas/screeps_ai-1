var tasks = {
    enterRoom: function(creep) {
      if (creep.pos.x==0) {creep.move(RIGHT);
      } else if (creep.pos.x==49) {creep.move(LEFT);
      } else if (creep.pos.y==49) {creep.move(TOP);
      } else if (creep.pos.y==0) {creep.move(BOTTOM);}

    },
    scoutRoom2: function(creep) {
      if (creep.room.name == creep.memory.targetRoom) {
        if (!Memory.rooms[creep.memory.targetRoom]) Memory.rooms[creep.memory.targetRoom]={};
        if (!Memory.rooms[creep.memory.targetRoom].scoutFromOther) Memory.rooms[creep.memory.targetRoom].scoutFromOther={};
        var scout=Memory.rooms[creep.memory.targetRoom].scoutFromOther;
        let lastScout = scout.lastScout;
        let lastFullScout = scout.lastFullScout;
        if (!lastScout||(Game.time-lastScout)>5) {
          var sources= creep.room.find(FIND_SOURCES);
          if (!scout.sources) {scout.sources={}}
          if (!scout.from) {scout.from={}}
          if (!scout.from[creep.memory.homeRoom]) {scout.from[creep.memory.homeRoom]={}}
          for (var i = 0; i < sources.length; i++) {
            if (!scout.sources[sources[i].id]) {
              scout.sources[sources[i].id]={}
            }
            scout.sources[sources[i].id].pos=sources[i].pos
          }

          var myConstructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
          var allStructures = creep.room.find(FIND_STRUCTURES);
          var damagedBuildings = 0;
          _.forEach(allStructures, function(struc){
            if (struc.hitsMax!==undefined && struc.hits<struc.hitsMax*0.5) {
              damagedBuildings++;
            }
          });
          scout.myConstructionSites=myConstructionSites.length;
          scout.myDamagedStructures=damagedBuildings;


          var hostiles=creep.room.find(FIND_HOSTILE_CREEPS);
          var npcInvadersWeak=0;
          var dangerousHostiles=0;
          var totalBodyParts=0;
          var hostileStruc=creep.room.find(FIND_HOSTILE_STRUCTURES,{filter:(structure)=>{return structure.structureType!=STRUCTURE_STORAGE}});
          _.forEach(hostiles, function(creep){
            for (var i=0;i<creep.body.length;i++) {
              totalBodyParts++;
              if (creep.body[i].boost) totalBodyParts++;
            }
            if (creep.owner.username=='Invader' && creep.body.length<=16) {npcInvadersWeak++;} else {
              if (creep.getActiveBodyparts(ATTACK)+creep.getActiveBodyparts(RANGED_ATTACK)>0) dangerousHostiles++;
            }
          });

          if (hostileStruc.length || dangerousHostiles>3) {
            scout.danger=10;
          } else if (npcInvadersWeak>=1 || dangerousHostiles>0){
            console.log('attack with bp: ',totalBodyParts);
            if (totalBodyParts<=10) {scout.danger=1;}
            else if (totalBodyParts<=20) {scout.danger=2;}
            else {scout.danger=3;}
          } else {
            scout.danger=0;
          }
          var controller = creep.room.controller;
          if (controller) {
            var reservation = controller.reservation;
            if (reservation) {
              if (reservation.username=='vestad') {
                scout.reservation=reservation.ticksToEnd;
              } else {
                scout.reservation=-1;
              }
            } else {
              scout.reservation=0;
            }
          }
          scout.lastScout=Game.time;
          //Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].timeSinceLastScout=0;
        }

        if (!lastFullScout||(Game.time-lastFullScout)>300) {
          console.log('perming big check')
          var spawn= Game.rooms[creep.memory.homeRoom].find(FIND_MY_SPAWNS)[0];
          var storage= Game.rooms[creep.memory.homeRoom].storage;
          scout.from[creep.memory.homeRoom].sources={};
          if (storage) {
            var totalLenght=0;
            var pathComplete=true;
            for (var source in scout.sources) {
              scout.from[creep.memory.homeRoom].sources[source]={};
              var path = new PathFinder.search(storage.pos,{pos:Game.getObjectById(source).pos,range:1},{plainCost: 1,swampCost: 1});
              if (path) {
                scout.from[creep.memory.homeRoom].sources[source].pathLen=path.path.length;
                totalLenght+=path.path.length;
              } else pathComplete=false;
            }
            if (!scout.closestRoom||!scout.closest||(totalLenght<scout.closest)) {
              scout.closestRoom=creep.memory.homeRoom;
              scout.closest=totalLenght;
              //console.log('Found new closest '+scout.closestRoom);
            }
          }
          for (var source in scout.sources) {
            var obj = Game.getObjectById(source);
            var container = obj.pos.findInRange(FIND_STRUCTURES,3,{filter: (structure) => {return (structure.structureType==STRUCTURE_CONTAINER)}})[0]
            if (container) {
              scout.from[creep.memory.homeRoom].sources[source].container=container;
            } else {
              scout.from[creep.memory.homeRoom].sources[source].container=null;
            }
          }
          scout.lastFullScout=Game.time;
      }
        Memory.rooms[creep.memory.targetRoom].scoutFromOther=scout;
      }
    },
    scoutRoom: function(creep) {
      tasks.scoutRoom2(creep);
      /*
      if (creep.room.name == creep.memory.targetRoom && Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom]) {
        let timeSinceLastScout = Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].timeSinceLastScout;
        let timeSinceLastFullScout = Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].timeSinceLastFullScout;
        if (timeSinceLastScout>=5 || timeSinceLastScout==-1) {
          var sources= creep.room.find(FIND_SOURCES);
          if (!Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].sources) {
            Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].sources={}
          }
          for (var i = 0; i < sources.length; i++) {
            if (!Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].sources[sources[i].id]) {
              Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].sources[sources[i].id]={}
            }
            Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].sources[sources[i].id].pos=sources[i].pos
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
          var dangerousHostiles=0;
          var hostileStruc=creep.room.find(FIND_HOSTILE_STRUCTURES);
          _.forEach(hostiles, function(creep){
            if (creep.owner.username=='Invader' && creep.body.length<=16) {npcInvadersWeak++;} else {
              if (creep.getActiveBodyparts(ATTACK)+creep.getActiveBodyparts(RANGED_ATTACK)>0) dangerousHostiles++;
            }
          });

          if (hostileStruc.length || dangerousHostiles>2) {
            Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].danger=10;
          } else if (npcInvadersWeak>=1 || dangerousHostiles>0){
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
          var storage= Game.rooms[creep.memory.homeRoom].storage;
          if (storage) {
            for (var source in scout.sources) {
              var path = new PathFinder.search(storage.pos,{pos:Game.getObjectById(source).pos,range:1},{plainCost: 1,swampCost: 1});
              if (path) {
                Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].sources[source].pathLen=path.path.length;
              }
            }
          }
          for (var source in scout.sources) {
            var obj = Game.getObjectById(source);
            var container = obj.pos.findInRange(FIND_STRUCTURES,3,{filter: (structure) => {return (structure.structureType==STRUCTURE_CONTAINER)}})[0]
            if (container) {
              Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].sources[source].container=container;
            } else {
              Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].sources[source].container=null;
            }
          }
          Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].timeSinceLastFullScout=0;
        }
      }
      */
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
      var extensions=creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION) && (structure.energy < structure.energyCapacity)}});
      extensions= _.sortBy(extensions, e => creep.pos.getRangeTo(e.pos));
      var centralStoragePri=spawn.pos.findInRange(FIND_STRUCTURES,6, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE) && (structure.store[RESOURCES_ALL] < 10000)}});
      var centralStorage=spawn.pos.findInRange(FIND_STRUCTURES,6, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE)}});
      var centralLink=spawn.pos.findInRange(FIND_STRUCTURES,6, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK) && (structure.energy < structure.energyCapacity)}});
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,6, {filter: (structure) => {  return (structure.structureType == STRUCTURE_CONTAINER)  }});

	     var target = []
      target = target.concat(towerCritical);
      target = target.concat(spawnTar);
      target = target.concat(extensions);
      target = target.concat(tower);
      target = target.concat(centralStoragePri);
      target = target.concat(centralLink);
      target = target.concat(centralStorage);
      target = target.concat(centralContainer);
      if (target.length) {
        if (target[0].structureType==STRUCTURE_STORAGE) {
          for(var resourceType in creep.carry) {
              if (creep.transfer(target[0], resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0]);
              }
            }
        } else if(creep.transfer(target[0], RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
            creep.moveTo(target[0]);
        }
    } else creep.moveTo(creep.room.controller)
    },

    deliverSourceToMainLinkFirst: function(creep) {
      var towerCritical=creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity*0.6)}});
      var spawn = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN)}})[0];
      var centralLink=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK) && (creep.carry.energy == creep.carryCapacity && structure.energy < 400)}});
      var centralLinkCrit=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK) && (creep.carry.energy == creep.carryCapacity && structure.energy <= 200)}});


      var tower=creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity*0.95)}});
      //var spawnTar = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN) && (structure.energy < structure.energyCapacity)}});
      var extensions=creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION||structure.structureType == STRUCTURE_SPAWN) && (structure.energyCapacity-structure.energy > 0)&&(structure.energyCapacity-structure.energy <= creep.carry[RESOURCE_ENERGY])}});
      //extensions= _.sortBy(extensions, e => creep.pos.getRangeTo(e.pos));
      var centralStorage=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE) }});

       var target = []
       target = target.concat(towerCritical);
       target = target.concat(centralLinkCrit);

      //target = target.concat(spawnTar);
      if (extensions) target.push(extensions)
      target = target.concat(tower);
      if (creep.room.terminal&&creep.room.terminal.store[RESOURCE_ENERGY]<3000) target.push(creep.room.terminal);
      target = target.concat(centralLink);
      target = target.concat(centralStorage);

      if (target[0].structureType==STRUCTURE_STORAGE) {
        for(var resourceType in creep.carry) {
          if(creep.transfer(target[0], resourceType)== ERR_NOT_IN_RANGE) {
              creep.moveTo(target[0]);
          }
        }
      } else {
        if(creep.transfer(target[0], RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
            creep.moveTo(target[0]);
        }
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
      var centralStorage=creep.room.storage;
      if (centralStorage) {
        var centralLink=centralStorage.pos.findInRange(FIND_STRUCTURES,5, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK && structure.energy==800) }});
        target = target.concat(centralLink);
        target = target.concat(centralStorage);
      }
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,5, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER) }});
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
      ) && (structure.store[RESOURCE_ENERGY]>0); } });

      var index = targets.indexOf(centralContainer);
      if(index != -1) targets.splice( index, 1 );

      targets = _.sortBy(targets, s => -s.store[RESOURCE_ENERGY]);
      //console.log(targets[0]);
      return targets[0];
    },
    findStructureToRepair: function(creep) {

      var targetCrit = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: struct => ((struct.hits<struct.hitsMax*0.50 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART) || (struct.hits<creep.room.memory.wallHitsmin/2 && (struct.structureType==STRUCTURE_WALL||struct.structureType==STRUCTURE_RAMPART)))});
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
      var centralStorage=spawn.pos.findInRange(FIND_STRUCTURES,5, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY]>=creep.carryCapacity) }});
      var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,5, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY]>=creep.carryCapacity)  }});
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
      var result = creep.harvest(source)
      if( result == ERR_NOT_IN_RANGE || result == ERR_NOT_ENOUGH_RESOURCES ) {
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
