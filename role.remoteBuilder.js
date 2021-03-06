var tasks = require('tasks');
var prototypeCreep = require('prototype.creep');
Creep.prototype.runRemoteBuilder = function(creep) {

    if(creep.memory.building && creep.carry.energy == 0) {
          creep.memory.building = false;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
        creep.memory.target= null;
    }

    if(creep.room.name != creep.memory.targetRoom) {
      if (Game.rooms[creep.memory.targetRoom]) {
        creep.moveTo(Game.rooms[creep.memory.targetRoom].controller,{maxRooms:1})
      } else {
        var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
        var exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit,{maxRooms:1});
      }

    } else {
      if(creep.memory.building) {

        if (creep.memory.targetFix===null || creep.memory.targetFix===undefined) {
          creep.memory.targetFix= tasks.findStructureToRepair(creep);
        }

        if (creep.memory.targetFix===null || creep.memory.targetFix===undefined) {
          var targetsPri = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES,{filter: (structure) => { return (
                          structure.structureType == STRUCTURE_TOWER ||
                          structure.structureType == STRUCTURE_SPAWN ||
                          structure.structureType == STRUCTURE_STORAGE ||
                          structure.structureType == STRUCTURE_LINK ||
                          structure.structureType == STRUCTURE_CONTAINER  ||
                          structure.structureType == STRUCTURE_EXTENSION  )  } });
          var targetsAll = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(targetsPri) {
                if(creep.build(targetsPri) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetsPri,{maxRooms:1});
                }
            } else if (targetsAll) {
              if(creep.build(targetsAll) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(targetsAll,{maxRooms:1});
              }
            } else {
                creep.memory.targetFix= tasks.findStructureToRepairIdle(creep);
                if (creep.memory.targetFix==null) creep.memory.role='suicide';
                creep.memory.repairToFull=true;
              }
            } else {
              var struct=Game.getObjectById(creep.memory.targetFix);
              if (struct==null) {
                creep.memory.targetFix=null;//got desotryed?creep.say('kill me')
              }
              //creep.say(creep.repair(Game.getObjectById(creep.memory.targetFix)));
              if((creep.memory.repairToFull && struct.hits<struct.hitsMax) || (struct.hits<struct.hitsMax*0.75 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART) || (struct.hits<creep.room.memory.wallHitsMax && (struct.structureType==STRUCTURE_WALL||struct.structureType==STRUCTURE_RAMPART))) {
                //console.log(Game.getObjectById(creep.memory.targetFix).hits,'  ',Game.getObjectById(creep.memory.targetFix).hitsMax*0.75);
                  if(creep.repair(Game.getObjectById(creep.memory.targetFix)) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(Game.getObjectById(creep.memory.targetFix),{maxRooms:1});
                  }
                } else {
                  creep.memory.targetFix=null;
                  creep.memory.repairToFull=false;
                }
            }

      } else {
        //var flag = Memory.flags['dismantle'];
        var foundDismantle=false;
        var flag = Game.flags['dis']
        if (flag&&flag.pos.roomName==creep.room.name) {
          var target=flag.pos.findInRange(FIND_STRUCTURES,1,{filter:(structure)=>{return structure.hits>0}});
          if (target.length) {
            foundDismantle=true;
            if (creep.dismantle(target[0])==ERR_NOT_IN_RANGE) {
              creep.moveTo(target[0],{maxRooms:1})
            }
          }
        }
        if (!foundDismantle) {
          var container = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter:(structure)=> {return structure.structureType==STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY]>0} })
          if (container) {
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(container,{swampCost:1,plainCost:1,maxRooms:1});
            }
          } else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES,{filter: (source) => {return source.energy>0} });
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source,{swampCost:1,plainCost:1,maxRooms:1});
            }
          }
        }
      }

    }
  }
