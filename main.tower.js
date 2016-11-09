var mainTower = {
  run: function(room) {
    var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});

    _.forEach(towers, function(tower){

      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      var allHostiles = tower.room.find(FIND_HOSTILE_CREEPS,{
              filter: (creep) => {
                  var hits = creep.hits;
                  var attacks = creep.getActiveBodyparts(ATTACK);
                  var ranges = creep.getActiveBodyparts(RANGED_ATTACK);
                  var moves = creep.getActiveBodyparts(MOVE);
                  var heals = creep.getActiveBodyparts(HEAL);
                  return (heals>0 || ranges>0 || (attacks>0 && moves>0));
              }
      });
      allHostiles=_.sortBy(allHostiles, creep => creep.hits);
      var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: struct => ((struct.hits<struct.hitsMax*0.25 && struct.structureType!=STRUCTURE_WALL && struct.structureType!=STRUCTURE_RAMPART) || (struct.hits<room.memory.wallHitsmin/2 && (struct.structureType==STRUCTURE_WALL||struct.structureType==STRUCTURE_RAMPART)))   });

      var damagedCreeps = tower.pos.findClosestByRange(FIND_CREEPS, {filter: (creep) => creep.hits < creep.hitsMax});

      if(allHostiles.length) {
        tower.attack(allHostiles[0]);
      } else if(closestHostile) {
        tower.attack(closestHostile);
      } else if (damagedCreeps) {
        tower.heal(damagedCreeps);
      } else if (closestDamagedStructure && tower.energy>=500) {
        tower.repair(closestDamagedStructure);
      }

    });

  }
};
module.exports = mainTower;
