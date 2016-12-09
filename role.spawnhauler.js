var tasks = require('tasks');
Creep.prototype.runSpawnhauler = function(creep) {

    var pickupdropped = function(creep) {
      var dropped = Game.getObjectById(creep.memory.targetDropped)
      if (dropped===null) {
        creep.memory.targetDropped=null;
        return;
      }
      creep.say('d: '+creep.pos.getRangeTo(dropped));
      if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
        creep.moveTo(dropped);
      }
    }
	    if(creep.memory.delivering && creep.carry.energy < 50) {
            creep.memory.delivering = false;
	    }
	    if(!creep.memory.delivering &&  _.sum(creep.carry) == creep.carryCapacity) {
          creep.memory.targetContainer= null;
	        creep.memory.delivering = true;
	    }

	    if(creep.memory.delivering) {
        tasks.deliverSourceToMainLinkFirst(creep);
	    } else {
        if (creep.memory.targetDropped) {
          pickupdropped(creep);
        } else {
          var dropped = creep.pos.findInRange(FIND_DROPPED_RESOURCES,10,{filter:(dropped)=>{return dropped.amount>200}});
          if (dropped.length) {
            creep.memory.targetDropped=dropped[0].id;
            pickupdropped(creep);
          } else {
              tasks.haulFromCentralCotainers(creep);
            }
        }

	    }
	};
