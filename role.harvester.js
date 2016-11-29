var tasks = require('tasks');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.delivering && creep.carry.energy == 0) {
              creep.memory.delivering = false;
        }
        if(!creep.memory.delivering && creep.carry.energy >= Math.floor(creep.carryCapacity / (2*creep.getActiveBodyparts(WORK)) )*(2*creep.getActiveBodyparts(WORK)) ) { //TODO: creep.carryCapacity
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
        var link = sourceObj.pos.findInRange(FIND_MY_STRUCTURES,3,{ filter: (structure) => {return (structure.structureType == STRUCTURE_LINK)  } });
        var containers = sourceObj.pos.findInRange(FIND_STRUCTURES,5,{ filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER )  } });
        var containersUnfinished = sourceObj.pos.findInRange(FIND_CONSTRUCTION_SITES,5,{filter: (structure) => {return ( structure.structureType == STRUCTURE_CONTAINER )  }});
        if (link.length) {
          tasks.deliverSourceDedicated(creep,link[0]);//
        } else if (containers.length>0) {
          tasks.deliverSourceDedicated(creep,containers[0]);//
        } else {
          if (containersUnfinished.length>0 && !(tasks.checkSourceNeeded(creep))) {
            tasks.buildTarget(creep,containersUnfinished[0]);
          } else {
            tasks.deliverSource(creep);
          }

        }


      }
	}
};

module.exports = roleHarvester;
