var mainSpawn = require('main.spawn');
var buildExtension = require('build.extension');
var buildContainers = require('build.containers');
var buildRoads = require('build.roads');

var roleHarvester = require('role.harvester');
var roleHarvesterBig = require('role.harvesterBig');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    var extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
    var containers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }});
    var roads = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_ROAD }});

    buildContainers.run();
    if (containers.length>=1) buildExtension.run()
    if (containers.length>=1&&extensions.length>=3) buildRoads.run();

    var posSpawn = new RoomPosition(Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y+1, Game.spawns['Spawn1'].room.name);
    var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    for(var source in sources) {
          var path = new PathFinder.search(posSpawn,{pos:source,range:1});
          if (path.incomplete) sources.delete(source);
    }

    //if (!path.incomplete) {
    console.log(sources.length);

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
        if(creep.memory.role == 'harvester') {roleHarvester.run(creep);}
        if(creep.memory.role == 'harvesterBig') {roleHarvesterBig.run(creep);}
        if(creep.memory.role == 'hauler') {roleHauler.run(creep);}
        if(creep.memory.role == 'upgrader') {roleUpgrader.run(creep);}
        if(creep.memory.role == 'builder') {roleBuilder.run(creep);}
    }
}
