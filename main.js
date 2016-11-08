var mainSpawn = require('main.spawn');
var mainRoom = require('main.room');
var mainTower = require('main.tower');

var roleHarvester = require('role.harvester');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleScout = require('role.scout');

module.exports.loop = function () {

  var cpu = Game.cpu;
  var timeLast=cpu.getUsed();
  for(var iRoom in Game.rooms) {
    var room = Game.rooms[iRoom]
    var spawn = room.find(FIND_MY_SPAWNS)[0];
    timeLast=cpu.getUsed(); mainRoom.run(room); var timeMain= cpu.getUsed()-timeLast;
    timeLast=cpu.getUsed(); mainTower.run(room); var timeTower= cpu.getUsed()-timeLast;
    if (spawn.length) {
      timeLast=cpu.getUsed(); mainSpawn.run(); var timeSpawn = cpu.getUsed()-timeLast;
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
  timeLast=cpu.getUsed();
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        //try {
          if(creep.memory.role == 'harvester') {roleHarvester.run(creep);}
          if(creep.memory.role == 'hauler') {roleHauler.run(creep);}
          if(creep.memory.role == 'upgrader') {roleUpgrader.run(creep);}
          if(creep.memory.role == 'builder') {roleBuilder.run(creep);}
          if(creep.memory.role == 'scout') {roleScout.run(creep);}
      //} catch(err) { Game.notify(err)}
    }
    var timeAI = cpu.getUsed()-timeLast;

    console.log('CPU('+cpu.getUsed()+'): main: '+timeMain+', tower: '+timeTower+', spawn: '+timeSpawn+', AI: '+timeAI);

}
