var mainTower = {
  run: function(room) {
    var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});

    _.forEach(towers, function(tower){
      console.log('found a tower');
      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if(closestHostile) {
          tower.attack(closestHostile);
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
