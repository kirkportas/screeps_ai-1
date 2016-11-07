var mainSpawn = require('main.spawn');
var mainRoom = require('main.room');
var mainTower = require('main.tower');

var roleHarvester = require('role.harvester');
var roleHarvesterBig = require('role.harvesterBig');
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
    timeLast=cpu.getUsed(); mainRoom.run(room); console.log('time mainRoom: ',cpu.getUsed()-timeLast);
    timeLast=cpu.getUsed(); mainTower.run(room); console.log('time tower: ',cpu.getUsed()-timeLast);
    timeLast=cpu.getUsed(); mainSpawn.run(); console.log('time spawn: ',cpu.getUsed()-timeLast);

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
          if(creep.memory.role == 'harvesterBig') {roleHarvesterBig.run(creep);}
          if(creep.memory.role == 'hauler') {roleHauler.run(creep);}
          if(creep.memory.role == 'upgrader') {roleUpgrader.run(creep);}
          if(creep.memory.role == 'builder') {roleBuilder.run(creep);}
          if(creep.memory.role == 'scout') {roleScout.run(creep);}
      //} catch(err) { Game.notify(err)}
    }
    console.log('creep AI time: ',cpu.getUsed()-timeLast);

}
