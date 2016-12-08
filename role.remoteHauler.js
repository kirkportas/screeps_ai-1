var tasks = require('tasks');
var prototypeCreep = require('prototype.creep');

Creep.prototype.runRemoteHauler = function(creep) {
  var hostiles = creep.room.find(FIND_HOSTILE_CREEPS,{filter: (hostile) => { return (hostile.getActiveBodyparts(ATTACK)+hostile.getActiveBodyparts(RANGED_ATTACK)>0)}});
  if (creep.hits<creep.hitsMax || hostiles.lenght) {
      creep.memory.fleeTime=30;
  }
  if (creep.memory.fleeTime) {//
    creep.memory.fleeTime--;
  }

  if(creep.memory.delivering && creep.carry.energy == 0) {
        creep.memory.delivering = false;
  }
  if(!creep.memory.delivering && (creep.carry.energy >= creep.carryCapacity*0.7 || creep.memory.fleeTime>0)) {
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
    //var found = creep.room.lookForAtArea(LOOK_STRUCTURES,Math.max(0,creep.pos.y-2),Math.max(0,creep.pos.x-2),Math.min(49,creep.pos.y+2),Math.min(49,creep.pos.x+2));
    var found = creep.pos.findInRange(FIND_STRUCTURES,3,{filter:(structure)=>{return (structure.structureType==STRUCTURE_ROAD&&structure.hits<structure.hitsMax)}})
    //  {filter:(structure)=>{return (strcture.structureType==STRUCTURE_ROAD&&structure.hits<structure.hitsMax)}}
    if (found.length) {
      creep.repair(found[0]);
    }
    var centralStorage=Game.rooms[creep.memory.homeRoom].storage;
    if (centralStorage) {
    if(creep.transfer(centralStorage, RESOURCE_ENERGY)== OK) {
      } else {
        creep.moveToOpt(centralStorage);
      }
    }



  }


};
