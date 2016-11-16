var roomCreepcalc = {
  creepCount: function(room) {
    var count = {};
    count.harvesters = _.filter(Game.creeps, (creep)    => creep.memory.homeRoom == room.name && creep.memory.role == 'harvester' && creep.ticksToLive>50).length;
    count.haulers = _.filter(Game.creeps, (creep)       => creep.memory.homeRoom == room.name && creep.memory.role == 'hauler' && creep.ticksToLive>50).length;
    count.spawnHaulers = _.filter(Game.creeps, (creep)  => creep.memory.homeRoom == room.name && creep.memory.role == 'spawnHauler').length;
    count.upgraders = _.filter(Game.creeps, (creep)     => creep.memory.homeRoom == room.name && creep.memory.role == 'upgrader'&& creep.ticksToLive>50).length;
    count.builders = _.filter(Game.creeps, (creep)      => creep.memory.homeRoom == room.name && creep.memory.role == 'builder'&& creep.ticksToLive>10).length;
    count.scouts = _.filter(Game.creeps, (creep)        => creep.memory.homeRoom == room.name && creep.memory.role == 'scout'&&  creep.ticksToLive>50).length;
    count.defenders = _.filter(Game.creeps, (creep)      => creep.memory.homeRoom == room.name && creep.memory.role == 'defender').length;
    count.attacker = _.filter(Game.creeps, (creep)      => creep.memory.homeRoom == room.name && creep.memory.role == 'attacker').length;
    count.claimers = _.filter(Game.creeps, (creep)      => creep.memory.homeRoom == room.name && creep.memory.role == 'claimer').length;
    count.remoteBuilders = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == room.name && creep.memory.role == 'remoteBuilder').length;
    return count;
  },
  creepsNeeded: function(room) {

  }
};
module.exports = roomCreepcalc;
