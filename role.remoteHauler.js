var tasks = require('tasks');

var roleRemoteHauler = {

    run: function(creep) {
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
      if(!creep.memory.delivering && (creep.carry.energy == creep.carryCapacity || creep.memory.fleeTime>0)) {
          creep.memory.delivering = true;
      }


      if(!creep.memory.delivering) {
        if (!tasks.pickupEnergy(creep)) {
          //if(creep.room.name != creep.memory.targetRoom) {


              var target = Game.getObjectById(creep.memory.pref)
              var result = creep.withdraw(target, RESOURCE_ENERGY)

              if( target==null || result == ERR_NOT_IN_RANGE) {
                creep.moveTo(new RoomPosition(creep.memory.prefPos.x,creep.memory.prefPos.y,creep.memory.prefPos.roomName));
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
          var resBefore=creep.carry[RESOURCE_ENERGY];
          if (centralStorage) {
          if(creep.transfer(centralStorage, RESOURCE_ENERGY)== OK) {
              creep.memory.harvested+=(resBefore);
            } else {
              creep.moveTo(centralStorage);
            }
          } else if (centralContainer) {
            if(creep.transfer(centralContainer, RESOURCE_ENERGY)== OK) {
                creep.memory.harvested+=(resBefore);
              } else {
                creep.moveTo(centralContainer);
              }
            }
        }


      }


    }
};

module.exports = roleRemoteHauler;
