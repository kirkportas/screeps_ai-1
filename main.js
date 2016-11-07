var mainSpawn = require('main.spawn');
var mainRoom = require('main.room');
var mainTower = require('main.tower');

var roleHarvester = require('role.harvester');
var roleHarvesterBig = require('role.harvesterBig');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

  for(var iRoom in Game.rooms) {
    var room = Game.rooms[iRoom]
    var spawn = room.find(FIND_MY_SPAWNS)[0];

    mainRoom.run(room);

  }

    //mainRoom.run();
    mainSpawn.run();
    mainTower.run();


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {roleHarvester.run(creep);}
        if(creep.memory.role == 'harvesterBig') {roleHarvesterBig.run(creep);}
        if(creep.memory.role == 'hauler') {roleHauler.run(creep);}
        if(creep.memory.role == 'upgrader') {roleUpgrader.run(creep);}
        if(creep.memory.role == 'builder') {roleBuilder.run(creep);}
    }
}
