var tasks = require('tasks');
var prototypeCreep = require('prototype.creep');

Creep.prototype.runRemoteHauler = function(creep) {

  var repairRoads = function(creep) { //
    var foundStruc = creep.room.lookForAtArea(LOOK_STRUCTURES,Math.max(0,creep.pos.y-2),Math.max(0,creep.pos.x-2),Math.min(49,creep.pos.y+2),Math.min(49,creep.pos.x+2));
    var foundConst = creep.room.lookForAtArea(LOOK_CONSTRUCTION_SITES,Math.max(0,creep.pos.y-2),Math.max(0,creep.pos.x-2),Math.min(49,creep.pos.y+2),Math.min(49,creep.pos.x+2));
    foundStruc = _.filter(foundStruc, (strc)    => strc.structureType==STRUCTURE_ROAD);
    foundConst = _.filter(foundConst, (strc)    => strc.structureType==STRUCTURE_ROAD);

    //var foundStruc = creep.pos.findInRange(FIND_STRUCTURES,3,{filter:(structure)=>{return (structure.structureType==STRUCTURE_ROAD&&structure.hits<structure.hitsMax)}})
    //var foundConst= creep.pos.findInRange(FIND_CONSTRUCTION_SITES,3,{filter:(structure)=>{return (structure.structureType==STRUCTURE_ROAD)}})
    //  {filter:(structure)=>{return (strcture.structureType==STRUCTURE_ROAD&&structure.hits<structure.hitsMax)}}
    if (foundStruc.length) {
      creep.repair(foundStruc[0]);
    } else if (foundConst.length) {
      creep.build(foundConst[0]);
    }
  }

  var hostiles = creep.room.find(FIND_HOSTILE_CREEPS,{filter: (hostile) => { return (hostile.getActiveBodyparts(ATTACK)+hostile.getActiveBodyparts(RANGED_ATTACK)>0)}});
  if (creep.hits<creep.hitsMax || hostiles.lenght) {
      creep.memory.fleeTime=30;
  }
  if (creep.memory.fleeTime) {//
    creep.memory.fleeTime--;
  }

  if(creep.memory.delivering &&  _.sum(creep.carry)  == 0) {
        creep.memory.delivering = false;
  }
  if(!creep.memory.delivering && ( _.sum(creep.carry) >= creep.carryCapacity*0.7 || creep.memory.fleeTime>0)) {
      creep.memory.delivering = true;
  }

  if(!creep.memory.delivering) {
    if (!tasks.pickupEnergy(creep)) {
        var target = Game.getObjectById(creep.memory.pref)
        var result = creep.withdraw(target, RESOURCE_ENERGY)

        if( target==null || result == ERR_NOT_IN_RANGE) {
          creep.moveToOpt(new RoomPosition(creep.memory.prefPos.x,creep.memory.prefPos.y,creep.memory.prefPos.roomName));
        }

    } else if (creep.carry.energy == creep.carryCapacity*0.6) {creep.memory.delivering = true;}  //Picked up alot - should return?
  } else {
    repairRoads(creep);
    var centralStorage=Game.rooms[creep.memory.homeRoom].storage;
    if (centralStorage) {
      for(var resourceType in creep.carry) {
          if (creep.transfer(centralStorage, resourceType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(centralStorage);
          }
        }
    }



  }


};
