var tasks = require('tasks');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.targetFix= null;
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {

        if (creep.memory.targetFix===null || creep.memory.targetFix===undefined) {
          creep.memory.targetFix= tasks.findStructureToRepair(creep);
        }

        if(creep.memory.targetFix.hits<creep.memory.targetFix.hitsMax) {
            if(creep.repair(creep.memory.targetFix) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.memory.targetFix);
            }
          } else {


        	        var targetsPri = creep.room.find(FIND_CONSTRUCTION_SITES,{
                          filter: (structure) => {
                              return (
                                  structure.structureType == STRUCTURE_CONTAINER ||
                                  structure.structureType == STRUCTURE_EXTENSION )  }
                  });
                  var targetsAll = creep.room.find(FIND_CONSTRUCTION_SITES);
                  /*
                  for (var i=0;i<targets.length;i++) {
                    var t=targets[i];
                    var lairs = t.pos.findInRange(FIND_STRUCTURES,10, {
                            filter: (structure) => {
                                return (
                                    structure.structureType == STRUCTURE_KEEPER_LAIR && structure.my == false )  }
                    });
                    if (lairs.length>0) {
                      targets.splice(i,1);
                    }
                  } */
                    if(targetsPri.length) {
                        if(creep.build(targetsPri[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targetsPri[0]);
                        }
                    } else if (targetsAll.length) {
                      if(creep.build(targetsAll[0]) == ERR_NOT_IN_RANGE) {
                          creep.moveTo(targetsAll[0]);
                      }
                    } else {
                        creep.say('idle');
                        var targets = creep.room.find(FIND_STRUCTURES, {
                                    filter: (structure) => {
                                        return (structure.structureType == STRUCTURE_SPAWN);
                                    }
                            });
                            if(targets.length > 0) {
                                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(targets[0]);
                                }
                        }
            }
          }
	    } else {
        tasks.haulFromContainerAny(creep);
	    }
	}
};

module.exports = roleBuilder;
