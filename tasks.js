var tasks = {

    deliverSource: function(creep) {
      var targets = creep.room.find(FIND_STRUCTURES, {
              filter: (structure) => {
                  return (
                      structure.structureType == STRUCTURE_CONTAINER ||
                      structure.structureType == STRUCTURE_EXTENSION ||
                      structure.structureType == STRUCTURE_SPAWN ||
                      structure.structureType == STRUCTURE_TOWER
                          ) && (structure.energy < structure.energyCapacity) || (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
              }
      });
      _.sortBy(targets, s => creep.pos.getRangeTo(s))
      if(targets.length > 0) {
          if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[0]);
          }
      }
    };


}
