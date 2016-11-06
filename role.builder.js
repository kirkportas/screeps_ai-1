var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
	                /*
                  var targets = creep.room.find(FIND_STRUCTURES, {
                     filter: object => object.hits < (object.hitsMax/4)
                    });

                    targets.sort((a,b) => a.hits - b.hits);

                    if(targets.length > 0) {
                        if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    */

        	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
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
                  }
                    if(targets.length) {
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
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
	    else {
	       var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_CONTAINER
                                ) && (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 50);
                    }
            });
            if(targets.length > 0) {
                if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                	creep.moveTo(targets[0]);
                }
            } else {
    	        var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
	    }
	}
};

module.exports = roleBuilder;
