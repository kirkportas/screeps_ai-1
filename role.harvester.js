var tasks = require('tasks');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // -- INIT --
        var sources = Game.spawns['Spawn1'].room.memory.allSources;
        for (var i=0;i<sources.length;i++) {
          var source=sources[i];
          if (source.id === creep.memory.pref && !source.miners.includes(creep.id) && creep.id != null) {
            console.log('adding ',creep.id);
            source.miners.push(creep.id);
          }
        }

        if(creep.memory.delivering && creep.carry.energy == 0) {
              creep.memory.delivering = false;
              creep.say('delivering');
        }
        if(!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.delivering = true;
            creep.say('mining');
        }

	    if(!delivering) {
        if (creep.memory.pref) {
          tasks.harvestPrefered(creep);
        } else {
          tasks.harvestClosest(creep);
        }
      } else {
        var containers = creep.pos.findInRange(FIND_STRUCTURES,5,{ filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER )  } });
        var containersUnfinished = creep.pos.findInRange(FIND_CONSTRUCTION_SITES,5,{filter: (structure) => {return ( structure.structureType == STRUCTURE_CONTAINER )  }});
        if (containers.length>0) {
          tasks.deliverSource(creep);
        } else {
          if (containersUnfinished.length>0) {
            tasks.buildContainer(creep);
          } else {
            tasks.deliverSource(creep);
          }

        }


      }
	}
};

module.exports = roleHarvester;
