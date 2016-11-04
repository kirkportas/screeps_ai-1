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
        tasks.deliverSource(creep);
      }
	}
};

module.exports = roleHarvester;
