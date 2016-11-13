var mainSpawn = require('main.spawn');
var mainRoom = require('main.room');
var mainTower = require('main.tower');
var mainScout = require('main.scout');

var roleHarvester = require('role.harvester');
var roleHauler = require('role.hauler');
var roleSpawnhauler = require('role.spawnhauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleScout = require('role.scout');
var roleDefender = require('role.defender');
var roleAttacker= require('role.attacker');
var roleClaimer = require('role.claimer');
var roleRemotebuilder = require('role.remoteBuilder');
var roleScoutMiner = require('role.scoutMiner');

module.exports.loop = function () {

  var cpu = Game.cpu;
  var timeLast=cpu.getUsed();

  var timeSpawn=0;
  var timeRoom=0;
  var timeTower=0;
  var timeScout=0;


  for(var iRoom in Game.rooms) {
    var room = Game.rooms[iRoom]



    var spawn = room.find(FIND_MY_SPAWNS)[0];
    if (spawn!=undefined) {
      timeLast=cpu.getUsed(); mainRoom.run(room); timeRoom += cpu.getUsed()-timeLast;
      timeLast=cpu.getUsed(); mainTower.run(room); timeTower += cpu.getUsed()-timeLast;
      timeLast=cpu.getUsed(); mainSpawn.run(spawn); timeSpawn += cpu.getUsed()-timeLast;
      timeLast=cpu.getUsed(); mainScout.run(room); timeScout += cpu.getUsed()-timeLast;
    }

  }


  var timeHarvester=0;

  timeLast=cpu.getUsed();
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        //try {
          if(creep.memory.role == 'harvester') {roleHarvester.run(creep);}
          if(creep.memory.role == 'hauler') {roleHauler.run(creep);}
          if(creep.memory.role == 'spawnHauler') {roleSpawnhauler.run(creep);}
          if(creep.memory.role == 'upgrader') {roleUpgrader.run(creep);}
          if(creep.memory.role == 'builder') {roleBuilder.run(creep);}
          if(creep.memory.role == 'scout') {roleScout.run(creep);}
          if(creep.memory.role == 'warrior') {roleWarrior.run(creep);}
          if(creep.memory.role == 'defender') {roleDefender.run(creep);}
          if(creep.memory.role == 'claimer') {roleClaimer.run(creep);}
          if(creep.memory.role == 'remoteBuilder') {roleRemotebuilder.run(creep);}
          if(creep.memory.role == 'remoteHarvester') {roleRemoteharvester.run(creep);}
      //} catch(err) { Game.notify(err)}
    }
    var timeAI = cpu.getUsed()-timeLast;

    //console.log('CPU('+cpu.getUsed().toFixed(2)+'): room: '+timeRoom.toFixed(2)+', tower: '+timeTower.toFixed(2)+', spawn: '+timeSpawn.toFixed(2)+', AI: '+timeAI.toFixed(2)+' (har: '+timeHarvester.toFixed(2)+').');

}
