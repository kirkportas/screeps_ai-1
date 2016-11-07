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
      creep.say(creep.room.name);

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

          var exitDir = Game.map.findExit(creep.room, firstRoom);
          var exit = creep.pos.findClosestByRange(exitDir);
          creep.moveTo(exit);
        } else {
          var containers = Room[firstRoom].find(FIND_MY_STRUCTURES);
          console.log('yaaaaay ',containers.length);
          if (containers.length>0) {
            creep.moveTo(containers[0]);
          }
        }


      }


    }
};

module.exports = roleScout;
