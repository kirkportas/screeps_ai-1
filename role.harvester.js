var tasks = require('tasks');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // -- INIT --
        var sources = Game.spawns['Spawn1'].room.memory.allSources;
        Memory.test=Game.spawns['Spawn1'].room.memory.allSources;
        for (var i=0;i<sources.length;i++) {
          var source=sources[i];
          if (source.id === creep.memory.pref && (source.miners.includes(creep.id)==false) && (creep.id != null)) {
            console.log('adding ',creep.id,' as dedicated miner to source');
            Game.spawns['Spawn1'].room.memory.allSources[i].miners.push(creep.id);
            //console.log(' ',Game.spawns['Spawn1'].room.memory.allSources[i].miners.length);
          }
        }
        creep.say(creep.memory.pref);

        if(creep.memory.delivering && creep.carry.energy == 0) {
              creep.memory.delivering = false;
        }
        if(!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.delivering = true;
        }

	    if(!creep.memory.delivering) {
        if (creep.memory.pref) {
          tasks.harvestPrefered(creep);
        } else {
          tasks.harvestClosest(creep);
        }
      } else {
        var sourceObj=Game.getObjectById(creep.memory.pref);
        var containers = sourceObj.pos.findInRange(FIND_STRUCTURES,5,{ filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER )  } });
        var containersUnfinished = sourceObj.pos.findInRange(FIND_CONSTRUCTION_SITES,5,{filter: (structure) => {return ( structure.structureType == STRUCTURE_CONTAINER )  }});
        if (containers.length>0) {
          tasks.deliverSourceDedicated(creep,containers[0]);//
        } else {
          if (containersUnfinished.length>0 && !(tasks.checkSourceNeeded(creep))) {
            tasks.buildContainer(creep,containersUnfinished[0]);
          } else {
            tasks.deliverSource(creep);
          }

        }


      }
	}
};

module.exports = roleHarvester;
