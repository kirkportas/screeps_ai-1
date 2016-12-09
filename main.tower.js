Room.prototype.towerWork = function() {

    var closestDamagedStructure = this.find(FIND_STRUCTURES, {filter: struct => ((struct.hits<struct.hitsMax*0.25 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART) || (struct.hits<this.memory.wallHitsmin/8 && (struct.structureType==STRUCTURE_WALL||struct.structureType==STRUCTURE_RAMPART)))   });
    closestDamagedStructure=_.sortBy(closestDamagedStructure, s => s.hits);
    var allHostiles = this.find(FIND_HOSTILE_CREEPS,{
      filter: (creep) => {
        var hits = creep.hits;
        var attacks = creep.getActiveBodyparts(ATTACK);
        var ranges = creep.getActiveBodyparts(RANGED_ATTACK);
        var moves = creep.getActiveBodyparts(MOVE);
        var heals = creep.getActiveBodyparts(HEAL);
        return true
      }
    });
    allHostiles=_.sortBy(allHostiles, creep => creep.hits);



    var towers = this.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    _.forEach(towers, function(tower){
      var closeHostiles = tower.pos.findInRange(FIND_HOSTILE_CREEPS,10);
      closeHostiles=_.sortBy(closeHostiles, creep => creep.hits);
      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      var damagedCreeps = tower.pos.findClosestByRange(FIND_CREEPS, {filter: (creep) => creep.hits < creep.hitsMax});
      if(closeHostiles.length) {
        tower.attack(closeHostiles[0]);
      } else if(allHostiles.length) {
        tower.attack(allHostiles[0]);
      } else  if(closestHostile) {
        tower.attack(closestHostile);
      } else if (damagedCreeps) {
        tower.heal(damagedCreeps);
      } else if (closestDamagedStructure && tower.energy>=400) {
        tower.repair(closestDamagedStructure[0]);
      } else {
        this.memory.towerSleep=9;
      }

    });

  }
