var tasks = require('tasks');
var roleBuilder = {

    buildWalls: function (creep) {

    },

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
          var targetsPri = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES,{filter: (structure) => { return (
                          structure.structureType == STRUCTURE_TOWER ||
                          structure.structureType == STRUCTURE_STORAGE ||
                          structure.structureType == STRUCTURE_LINK ||
                          structure.structureType == STRUCTURE_CONTAINER ||
                          structure.structureType == STRUCTURE_EXTENSION  )  } });
          var targetsAll = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(targetsPri) {
                if(creep.build(targetsPri) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetsPri);
                }
            } else if (targetsAll) {
              if(creep.build(targetsAll) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(targetsAll);
              }
            } else {
                creep.memory.targetFix= tasks.findStructureToRepairIdle(creep);
                creep.memory.repairToFull=true;
              }
            } else {
              var struct=Game.getObjectById(creep.memory.targetFix);
              if (struct==null) creep.say('kill me')
              if((creep.memory.repairToFull && struct.hits<struct.hitsMax) || (struct.hits<struct.hitsMax*0.75 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART) || (struct.hits<creep.room.memory.wallHitsMax && (struct.structureType==STRUCTURE_WALL||struct.structureType==STRUCTURE_RAMPART))) {
                //console.log(Game.getObjectById(creep.memory.targetFix).hits,'  ',Game.getObjectById(creep.memory.targetFix).hitsMax*0.75);
                  if(creep.repair(Game.getObjectById(creep.memory.targetFix)) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(Game.getObjectById(creep.memory.targetFix));
                  }
                } else {
                  creep.memory.targetFix=null;
                  creep.memory.repairToFull=false;
                }
            }

	    } else {
        tasks.haulFromContainerAny(creep);
	    }
	}
};

module.exports = roleBuilder;