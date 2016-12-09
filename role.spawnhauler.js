var tasks = require('tasks');
Creep.prototype.runSpawnhauler = function(creep) {

  var deliverSourceToMainLinkFirst= function(creep) {
        var towerCritical=creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity*0.6)}});
        var spawn = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN)}})[0];
        var centralLink=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK) && (creep.carry.energy == creep.carryCapacity && structure.energy < 400)}});
        var centralLinkCrit=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK) && (creep.carry.energy == creep.carryCapacity && structure.energy <= 200)}});


        var tower=creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity*0.95)}});
        var extensions=creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION||structure.structureType == STRUCTURE_SPAWN) && (structure.energyCapacity-structure.energy > 0)&&(structure.energyCapacity-structure.energy <= creep.carry[RESOURCE_ENERGY])}});
        var centralStorage=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE) }});

         var target = []
         target = target.concat(towerCritical);
         target = target.concat(centralLinkCrit);

        if (extensions) target.push(extensions)
        target = target.concat(tower);
        if (creep.room.terminal&&creep.room.terminal.store[RESOURCE_ENERGY]<3000) target.push(creep.room.terminal);
        target = target.concat(centralLink);
        target = target.concat(centralStorage);

        if (target[0].structureType==STRUCTURE_STORAGE) {
          for(var resourceType in creep.carry) {
            if(creep.transfer(target[0], resourceType)== ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0]);
            }
          }
        } else {
          if(creep.transfer(target[0], RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
              creep.moveTo(target[0]);
          }
        }


      }
      var haulFromCentralCotainers= function(creep) {
        var linkUpgrade =creep.room.memory.linkUpgrade;
        var target = [];
        var spawn = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN)}})[0];
        var centralStorage=creep.room.storage;
        if (centralStorage) {
          if (linkUpgrade) {
            var centralLink=centralStorage.pos.findInRange(FIND_STRUCTURES,5, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK && structure.energy>=700) }});
            target = target.concat(centralLink);
          } else {
            var centralLink=centralStorage.pos.findInRange(FIND_STRUCTURES,5, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK && structure.energy>=100) }});
            target = target.concat(centralLink);
          }
          target = target.concat(centralStorage);
        }
        var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,5, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER) }});
        target = target.concat(centralContainer);
           if(creep.withdraw(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
             creep.moveTo(target[0]);
           }
      }
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
        deliverSourceToMainLinkFirst(creep);
	    } else {
        if (creep.memory.targetDropped) {
          pickupdropped(creep);
        } else {
          var dropped = creep.pos.findInRange(FIND_DROPPED_RESOURCES,10,{filter:(dropped)=>{return dropped.amount>200}});
          if (dropped.length) {
            creep.memory.targetDropped=dropped[0].id;
            pickupdropped(creep);
          } else {
              haulFromCentralCotainers(creep);
            }
        }

	    }
	};
