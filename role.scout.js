var tasks = require('tasks');

var roleScout = {

    run: function(creep) {
      if(creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
      }
      if(!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
          creep.memory.delivering = true;
      }
      var firstRoom='E65S62';
      var anotherRoomName='E65S61';

      if(!creep.memory.delivering) {
        console.log('going to seonc room');
        if(creep.room.name != anotherRoomName) {
          var exitDir = Game.map.findExit(creep.room, anotherRoomName);
          var exit = creep.pos.findClosestByRange(exitDir);
          creep.moveTo(exit);
        } else {
          tasks.harvestClosest(creep);
        }
      } else {
        if(creep.room.name != firstRoom) {
          creep.say(creep.room.name);
          var exitDir = Game.map.findExit(creep.room, firstRoom);
          var exit = creep.pos.findClosestByRange(exitDir);
          creep.moveTo(exit);
        } else {
          tasks.harvestClosest(creep);
          var containers = creep.pos.findClosestByRange(FIND_STRUCTURES,{ filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER )  } });
          if (containers.length>0) {
            tasks.deliverSourceDedicated(creep,containers[0]);
          }
        }


      }


    }
};

module.exports = roleScout;
