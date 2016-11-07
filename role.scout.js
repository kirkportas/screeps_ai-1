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
          var containers = Game.rooms[firstRoom].find(FIND_MY_STRUCTURES);
          var centralContainer=Game.spawns['Spawn1'].findInRange(FIND_STRUCTURES,5, {
                          filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER)
                        }})[0];
          console.log('yaaaaay ',containers.length);
          if (centralContainer) {
            creep.moveTo(centralContainer);
          }
        }


      }


    }
};

module.exports = roleScout;
