var tasks = require('tasks');
Creep.prototype.runSuicide = function(creep) {
      creep.memory.spawnerAction='KILL';
      var spawn= Game.rooms[creep.memory.homeRoom].find(FIND_MY_SPAWNS)[0];

      if(creep.room.name != creep.memory.homeRoom) {
        creep.say('1')
        var exitDir = Game.map.findExit(creep.room, creep.memory.homeRoom);
        var exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);
      } else {

        creep.moveTo(spawn);

      }
    }
