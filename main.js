var mainSpawn = require('main.spawn');
var mainRoom = require('main.room');

var roleHarvester = require('role.harvester');
var roleHarvesterBig = require('role.harvesterBig');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {


    mainRoom.run();
    mainSpawn.run();

    var tower = Game.getObjectById('fae2cfd64a4dd0ef19707798');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        //if(creep.memory.role == 'harvester') {roleHarvester.run(creep);}
        if(creep.memory.role == 'harvesterBig') {roleHarvesterBig.run(creep);}
        if(creep.memory.role == 'hauler') {roleHauler.run(creep);}
        if(creep.memory.role == 'upgrader') {roleUpgrader.run(creep);}
        if(creep.memory.role == 'builder') {roleBuilder.run(creep);}
    }
}
