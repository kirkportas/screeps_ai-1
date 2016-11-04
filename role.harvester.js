var tasks = require('tasks');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var sources = Game.spawns['Spawn1'].room.memory.allSources;
        for (var i=0;i<sources.length;i++) {
          var source=sources[i];
          if (source.id === creep.memory.pref && !source.miners.includes(creep.id) && creep.id != null) {
            console.log('adding ',creep.id);
            source.miners.push(creep.id);
          }
        }

	    if(creep.carry.energy < creep.carryCapacity) {
        if (creep.memory.pref) {
          tasks.harvestPrefered(creep);
        } else {
          tasks.harvestClosest(creep);
        }
      } else {

        var containers = creep.pos.findInRange(FIND_STRUCTURES,5,{
          filter: (structure) => {
              return (
                  structure.structureType == STRUCTURE_CONTAINER )  }

        });
        var containersUnfinished = creep.pos.findInRange(FIND_CONSTRUCTION_SITES,5,{
          filter: (structure) => {
              return (
                  structure.structureType == STRUCTURE_CONTAINER )  }

        });
        console.log('container id: ',containersUnfinished.length,' + ',containers.length);

        tasks.deliverSource(creep);
      }
	}
};

module.exports = roleHarvester;
