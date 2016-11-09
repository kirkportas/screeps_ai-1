var tasks = require('tasks');

var roleScout = {

    run: function(creep) {
      if(creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
            creep.memory.delivered+=creep.carryCapacity;
            creep.memory.target=null;
      }
      if(!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
          creep.memory.delivering = true;
      }
      //var startRoom='E65S62';
      //var targetRoom='E65S61';

      if(!creep.memory.delivering) {
        if(creep.room.name != creep.memory.targetRoom) {
          var value = creep.moveTo(Game.getObjectById(creep.memory.pref));
          if (value == ERR_INVALID_TARGET || value== ERR_NO_PATH) {
            var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
          }

        } else {
          if (creep.memory.target===null || creep.memory.target===undefined) {
            creep.memory.target = tasks.findBiggestInRoom(creep,Game.rooms[creep.memory.targetRoom]);
          }
          tasks.harvestPrefered(creep.memory.pref);
          //tasks.harvestBiggestInRoom(creep,Game.rooms[creep.memory.targetRoom],creep.memory.target);
        }
      } else {
        if(creep.room.name != creep.memory.startRoom) {
          var exitDir = Game.map.findExit(creep.room, creep.memory.startRoom);
          var exit = creep.pos.findClosestByRange(exitDir);
          creep.moveTo(exit);
        } else {
          var containers = Game.rooms[creep.memory.startRoom].find(FIND_MY_STRUCTURES);
          var centralContainer=Game.spawns['Spawn1'].pos.findInRange(FIND_STRUCTURES,5, {
                          filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER)
                        }})[0];
          if(creep.transfer(centralContainer, RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
              creep.moveTo(centralContainer);
          }
        }


      }


    }
};

module.exports = roleScout;
