var mainSpawn = require('main.spawn');
var mainRoom = require('main.room');
var mainTower = require('main.tower');

var roleHarvester = require('role.harvester');
var roleHauler = require('role.hauler');
var roleSpawnhauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleScout = require('role.scout');
var roleWarrior = require('role.warrior');

module.exports.loop = function () {

  var cpu = Game.cpu;
  var timeLast=cpu.getUsed();

  var timeSpawn=0;
  var timeRoom=0;
  var timeTower=0;


  for(var iRoom in Game.rooms) {
    var room = Game.rooms[iRoom]

    timeLast=cpu.getUsed(); mainRoom.run(room); timeRoom += cpu.getUsed()-timeLast;
    timeLast=cpu.getUsed(); mainTower.run(room); timeTower += cpu.getUsed()-timeLast;

    var spawn = room.find(FIND_MY_SPAWNS)[0];
    if (spawn!=undefined) {
      timeLast=cpu.getUsed(); mainSpawn.run(spawn); timeSpawn += cpu.getUsed()-timeLast;
    }

  }
/*
  for(var iRoom in Game.rooms) {
    var room = Game.rooms[iRoom]
    var spawn = room.find(FIND_MY_SPAWNS)[0];
    mainRoom.run(room);
    mainTower.run(room);
    mainSpawn.run();

  } */

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
      //} catch(err) { Game.notify(err)}
    }
    var timeAI = cpu.getUsed()-timeLast;

    console.log('CPU('+cpu.getUsed()+'): room: '+timeRoom+', tower: '+timeTower+', spawn: '+timeSpawn+', AI: '+timeAI+' (har: '+timeHarvester+').');

}
