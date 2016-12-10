var mainSpawn = require('main.spawn');
var mainRoom = require('main.room');
var mainTower = require('main.tower');
var mainScout = require('main.scout');

var tasks = require('tasks');

var roleHarvester = require('role.harvester');
var roleExtracter = require('role.extracter');
var roleHauler = require('role.hauler');
var roleSpawnhauler = require('role.spawnhauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleScout = require('role.scout');
var roleDefender = require('role.defender');
var roleAttacker= require('role.attacker');
var roleClaimer = require('role.claimer');
var roleRemotebuilder = require('role.remoteBuilder');
var roleRemoteHarvester = require('role.remoteHarvester');
var roleSuicide = require('role.suicide');
var roleRemoteHauler = require('role.remoteHauler');

const profiler = require('screeps-profiler');

profiler.enable();
module.exports.loop = function() {
  profiler.wrap(function() {

    var cpu = Game.cpu;
    if (cpu.bucket>5000) { // Skip tick if bucket too low
      for(var iRoom in Game.rooms) {
        try {
          var room = Game.rooms[iRoom]
          var spawns = room.find(FIND_MY_SPAWNS);
          if (spawns.length) {
            room.work(room);
            room.towerWork();
            mainScout.run(room);
            var spawnNum = (Game.time % spawns.length)
            spawns[spawnNum].work(spawns[spawnNum]);
          } catch(err) { Game.notify(err.stack+": "+err);console.log(err.stack+": "+err);}
        }

      }
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (!creep.spawning) {
              try {
                //tasks.enterRoom(creep);
                tasks.scoutRoom(creep);
                if(creep.memory.role == 'harvester') creep.runHarvester(creep);
                if(creep.memory.role == 'extracter') creep.runExtracter(creep);
                if(creep.memory.role == 'hauler') creep.runHauler(creep);
                if(creep.memory.role == 'spawnHauler') creep.runSpawnhauler(creep);
                if(creep.memory.role == 'upgrader') creep.runUpgrader(creep);
                if(creep.memory.role == 'builder') creep.runBuilder(creep);
                if(creep.memory.role == 'scout') creep.runScout(creep);
                if(creep.memory.role == 'defender') creep.runDefender(creep);
                if(creep.memory.role == 'attacker') creep.runAttacker(creep);
                if(creep.memory.role == 'claimer') creep.runClaimer(creep);
                if(creep.memory.role == 'remoteBuilder') creep.runRemoteBuilder(creep);
                if(creep.memory.role == 'remoteHarvester') creep.runRemoteHarvester(creep);
                if(creep.memory.role == 'suicide') creep.runSuicide(creep);
                if(creep.memory.role == 'remoteHauler') creep.runRemoteHauler(creep);
            } catch(err) { Game.notify(err.stack+": "+err);console.log(err.stack+": "+err);}
          }
        }
        if (cpu.bucket<9500) console.log('Bucket: ',cpu.bucket);
      } else {
        Game.notify('Bucket too low. Skipping')
      }
  });
}
