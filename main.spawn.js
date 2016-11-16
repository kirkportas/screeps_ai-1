var tasks = require('tasks');
var roomCreepcalc = require('room.creepcalc');
var spawnSpawncreeps = require('spawn.spawncreeps')
var mainSpawn = {

  run: function(spawn) {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    spawnSpawncreeps.run();

  var creeps = spawn.pos.findInRange(FIND_MY_CREEPS,1);
  _.forEach(creeps, function(creep){
    if (creep.memory.spawnerAction=='KILL') {
      spawn.recycleCreep(creep);
    } else if (creep && creep.ticksToLive<500 && creep.memory.spawnerAction=='RENEW' && creep.memory.role!='remoteHarvester') {
      spawn.renewCreep(creep);
    }
  });


  var hostileSpawn = spawn.pos.findInRange(FIND_HOSTILE_CREEPS,10); //
  var hostileConstroller = spawn.room.controller.pos.findInRange(FIND_HOSTILE_CREEPS,10);
  if (spawn.room.name=='E65S62' && (hostileSpawn.length||hostileConstroller.length)) {
    var value = spawn.room.controller.activateSafeMode();
    console.log('WARNING - ENEMY IN BASE - safemode activated: '+value);
    Game.notify('WARNING - ENEMY IN BASE - safemode activated: '+value);
  }


  }

};
module.exports = mainSpawn;
