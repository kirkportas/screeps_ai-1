var tasks = require('tasks');

var roleRemoteHarvester = {

    run: function(creep) {
      if(creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
      }
      if(!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
          creep.memory.delivering = true;
      }

      if (!creep.memory.harvested) creep.memory.harvested=0;
      if (creep.ticksToLive==1) {
        console.log('Remote Harvester died: '+creep.memory.pref+': '+creep.memory.harvested+'-'+creep.getActiveBodyparts(CARRY)*200);
        Game.notify('Remote Harvester died: '+creep.memory.pref+': '+creep.memory.harvested+'-'+creep.getActiveBodyparts(CARRY)*200,120);
      }

      if(!creep.memory.delivering) {
        if (!tasks.pickupEnergy(creep)) {
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
        } else if (creep.carry.energy == creep.carryCapacity*0.6) {creep.memory.delivering = true;}  //Picked up alot - should return?
      } else {
        var homeSpawn=Game.rooms[creep.memory.homeRoom].find(FIND_MY_SPAWNS)[0];
        if(creep.room.name != creep.memory.homeRoom) {
          var res = creep.moveTo(homeSpawn) ;
          if (res == ERR_INVALID_TARGET||res==ERR_NO_PATH) {
            var exitDir = Game.map.findExit(creep.room, creep.memory.homeRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
          }

        } else {
          var centralContainer=homeSpawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER)}})[0];
          var centralStorage=homeSpawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE)}})[0];
          var resBefore=creep.carry;
          if (centralStorage) {
          if(creep.transfer(centralStorage, RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
              creep.moveTo(centralStorage);
            }
          } else if (centralContainer) {
            if(creep.transfer(centralContainer, RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
                creep.moveTo(centralContainer);
              }
          }
          resAfter=creep.carry;
          creep.memory.harvested+=(resAfter-resBefore);
        }


      }


    }
};

module.exports = roleRemoteHarvester;
