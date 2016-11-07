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
        if(creep.room.name != creep.memory.targetRoom.name) {
          var exitDir = Game.map.findExit(creep.room, creep.memory.targetRoom);
          var exit = creep.pos.findClosestByRange(exitDir);
          creep.moveTo(exit);
        } else {
          if (creep.memory.target===null || creep.memory.target===undefined) {
            creep.memory.target = tasks.findBiggestInRoom(creep,Game.rooms[creep.memory.targetRoom]);
          }
          tasks.harvestBiggestInRoom(creep,Game.rooms[creep.memory.targetRoom],creep.memory.target);
        }
      } else {
        console.log(creep.room.name,'--',creep.memory.startRoom.name)
        if(creep.room.name != creep.memory.startRoom.name) {
          console.log('1');
          var exitDir = Game.map.findExit(creep.room, creep.memory.startRoom);
          var exit = creep.pos.findClosestByRange(exitDir);
          creep.moveTo(exit);
        } else {
          console.log('2');
          var containers = Game.rooms[creep.memory.startRoom.name].find(FIND_MY_STRUCTURES);
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
