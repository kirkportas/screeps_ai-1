var tasks = require('tasks');

var roleRemoteHarvester = {

    run: function(creep) {

      if(creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
      }
      if((!creep.memory.delivering &&  _.sum(creep.carry) == creep.carryCapacity)) {
          creep.memory.delivering = true;
      }



      if(!creep.memory.delivering) {
        if (!tasks.pickupEnergy(creep)) {
          //if(creep.room.name != creep.memory.targetRoom) {

              var source = Game.getObjectById(creep.memory.pref)
              var result = creep.harvest(source)
              if( source==null || result == ERR_NOT_IN_RANGE || result == ERR_NOT_ENOUGH_RESOURCES ) {
                  creep.moveTo(new RoomPosition(creep.memory.prefPos.x,creep.memory.prefPos.y,creep.memory.prefPos.roomName));
              }

        } else if (creep.carry.energy == creep.carryCapacity*0.6) {creep.memory.delivering = true;}  //Picked up alot - should return?
      } else {
        var containers = creep.pos.findInRange(FIND_STRUCTURES,5,{ filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER )  } })[0];
        var centralStorage=Game.rooms[creep.memory.homeRoom].find(FIND_STRUCTURES,8, {filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE)}})[0];
        if (containers) {
          tasks.deliverSourceDedicated(creep,containers);//
        } else if (centralStorage) {
          if(creep.transfer(centralStorage, RESOURCE_ENERGY)== OK) {
            } else {
              creep.moveTo(centralStorage);
            }
        }

      }


    }
};

module.exports = roleRemoteHarvester;
