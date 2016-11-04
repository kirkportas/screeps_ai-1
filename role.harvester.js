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

        var containers = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.structureType == STRUCTURE_CONTAINER && (new PathFinder.search(creep.pos,structure.pos )).length<5 ) }
        });
        var containersUnfinished = creep.room.find(FIND_CONSTRUCTION_SITES, {
          filter: (structure) => {
            return (
              structure.structureType == STRUCTURE_CONTAINER && (new PathFinder.search(creep.pos,structure.pos )).length<5 ) }
        });
        console.log('container id: ',containers.length);

        tasks.deliverSource(creep);
      }
	}
};

module.exports = roleHarvester;
