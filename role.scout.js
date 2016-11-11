var tasks = require('tasks');
var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.room.name != creep.memory.targetRoom) {
        var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
        var exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);
      } else {
        if (Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom]) {
          console.log('exists');

          var sources= creep.room.find(FIND_SOURCES);
          Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].sources={}
          for (var i = 0; i < sources.length; i++) {
            Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].sources[sources[i].id]={pos: sources[i].pos}
            //room.memory.scout[rooms[i]]={timeSinceLastScout:-1, danger:-1,sources:[]};
          }


          if (creep.room.find(FIND_HOSTILE_CREEPS)||creep.room.find(FIND_HOSTILE_STRUCTURES) {
            Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].danger=10;
          } else {
            Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].danger=0;
          }
          Memory.rooms[creep.memory.homeRoom].scout[creep.memory.targetRoom].timeSinceLastScout=0;


        }

        if (creep.moveTo(Game.rooms[creep.memory.targetRoom].controller) == ERR_NO_PATH) {
          var target = creep.pos.findClosestByRange(FIND_STRUCTURES);
          var res = creep.moveTo(target);
          creep.say(res);
        }

      }
    }
  };

  module.exports = roleScout;
