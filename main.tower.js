var mainTower = {
  run: function(room) {
    var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});

    _.forEach(towers, function(tower){

      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax*0.25});

      if(closestHostile) {
        tower.attack(closestHostile);
      } else if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
      }

    });

    var tower = Game.getObjectById('fae2cfd64a4dd0ef19707798');
    if(tower) {
        /*
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        */


    }
  }
};
module.exports = mainTower;
