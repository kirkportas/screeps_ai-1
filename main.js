var mainSpawn = require('main.spawn');
var mainRoom = require('main.room');
var mainTower = require('main.tower');

var roleHarvester = require('role.harvester');
var roleHarvesterBig = require('role.harvesterBig');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

  var cpu = Game.cpu;


  for(var iRoom in Game.rooms) {
    var room = Game.rooms[iRoom]
    var spawn = room.find(FIND_MY_SPAWNS)[0];
console.log('CPU info 0, ',cpu.getUsed());
    mainRoom.run(room);
    console.log('CPU info 1, ',cpu.getUsed());
    mainTower.run(room);
    console.log('CPU info 2, ',cpu.getUsed());
    mainSpawn.run();
    console.log('CPU info 3, ',cpu.getUsed());

  }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        //try {
          if(creep.memory.role == 'harvester') {roleHarvester.run(creep);}
          if(creep.memory.role == 'harvesterBig') {roleHarvesterBig.run(creep);}
          if(creep.memory.role == 'hauler') {roleHauler.run(creep);}
          if(creep.memory.role == 'upgrader') {roleUpgrader.run(creep);}
          if(creep.memory.role == 'builder') {roleBuilder.run(creep);}
      //} catch(err) { Game.notify(err)}
    }
    console.log('CPU info 4, ',cpu.getUsed());
}
