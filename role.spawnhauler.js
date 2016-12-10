var tasks = require('tasks');
Creep.prototype.runSpawnhauler = function(creep) {



  var findTarget= function(creep) {
        var target = []
        var linkUpgrade =creep.room.memory.linkUpgrade;
        var spawn = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN)}})[0];

        var towerCritical=creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity*0.6)}});
        if (towerCritical.length) {
          creep.memory.deliverId=towerCritical[0].id;
        } else {
          var centralLink=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_LINK) && (creep.carry.energy == creep.carryCapacity && structure.energy < 600)}});
          if (linkUpgrade&&centralLink.length) {
            creep.memory.deliverId=centralLink[0].id;
          } else {
            var tower=creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity*0.95)}});
            if (tower.length) {
              creep.memory.deliverId=tower[0].id;
            } else {
              var extensions=creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION||structure.structureType == STRUCTURE_SPAWN) && (structure.energyCapacity-structure.energy > 0)&&(structure.energyCapacity-structure.energy <= creep.carry[RESOURCE_ENERGY])}});
              if (extensions) {
                creep.memory.deliverId=extensions.id;
              } else {
                var centralStorage=spawn.pos.findInRange(FIND_STRUCTURES,8, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE) }});
                if (centralStorage.length) {
                  creep.memory.deliverId=centralStorage[0].id;
                }
              }
            }
          }
          deliverToTarget();

        }
        //if (creep.room.terminal&&creep.room.terminal.store[RESOURCE_ENERGY]<3000) target.push(creep.room.terminal);
      }
      var deliverToTarget=function(creep) {
        var target=Game.getObjectById(creep.memory.deliverId);
        if (target) {
          var result;
          if (target.structureType==STRUCTURE_STORAGE) {
            for(var resourceType in creep.carry) {
              if(result=creep.transfer(target, resourceType)== ERR_NOT_IN_RANGE) {
                  creep.moveTo(target);
              }
            }
          } else {
            if(result=creep.transfer(target, RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
          }
          if (result==0||result==ERR_FULL) {
            creep.memory.deliverId=null;
          }
        } else {
          console.log('spawnHauler lost target');
          creep.memory.deliverId=null;
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
        if (creep.memory.deliverId) {
          deliverToTarget(creep)
        } else {
          findTarget(creep);
        }
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
