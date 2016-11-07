var tasks = require('tasks');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {

        if (creep.memory.targetFix===null || creep.memory.targetFix===undefined) {
          creep.memory.targetFix= tasks.findStructureToRepair(creep);
        }

        if (creep.memory.targetFix===null || creep.memory.targetFix===undefined) {
          var targetsPri = creep.room.find(FIND_CONSTRUCTION_SITES,{filter: (structure) => { return (
                          structure.structureType == STRUCTURE_TOWER ||
                          structure.structureType == STRUCTURE_CONTAINER ||
                          structure.structureType == STRUCTURE_EXTENSION )  } });
          var targetsAll = creep.room.find(FIND_CONSTRUCTION_SITES);
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
              }
            } else {
              var struct=Game.getObjectById(creep.memory.targetFix);
              if (struct===null) creep.say('kill');
              if(struct.hits<struct.hitsMax*0.75 && struct.structureType!=STRUCTURE_WALL)) {
                //console.log(Game.getObjectById(creep.memory.targetFix).hits,'  ',Game.getObjectById(creep.memory.targetFix).hitsMax*0.75);
                  if(creep.repair(Game.getObjectById(creep.memory.targetFix)) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(Game.getObjectById(creep.memory.targetFix));
                  }
                } else {
                  creep.say('reset');
                  creep.memory.targetFix=null;
                }
            }

	    } else {
        tasks.haulFromContainerAny(creep);
	    }
	}
};

module.exports = roleBuilder;
