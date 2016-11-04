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



    var posSpawn = new RoomPosition(Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y+1, Game.spawns['Spawn1'].room.name);
    var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    var lairs = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_KEEPER_LAIR && structure.my == false )  }
    });


    if (!Game.spawns['Spawn1'].room.memory.allSources) {
      Game.spawns['Spawn1'].room.memory.allSources=[];

      for (var i = 0; i < sources.length; i++) {
          var path = new PathFinder.search(posSpawn,{pos:sources[i],range:1});
          var pathLen = path.path.length;
          var safe=1;
          var x=path.path[pathLen-1].x;
          var y=path.path[pathLen-1].y;

          var dist = 100;
          for (var ii = 0; ii < lairs.length; ii++) {
            var a = x - lairs[ii].pos.x;
            var b = y - lairs[ii].pos.y;
            var c = Math.sqrt( a*a + b*b );
            if (c<dist) dist=c;
            }
          if (dist<10) safe=0;

          var slots = 0;
          for (var x1=-1;x1<2;x1++) {
              for (var y1=-1;y1<2;y1++) {

               let items = Game.spawns['Spawn1'].room.lookAt(sources[i].pos.x+x1,sources[i].pos.y+y1);
                 for (let i=0;i<items.length;i++) {
                     if (items[i].terrain=='plain') {slots++;}
                 }
              }
          }

          //   {id: sources[i].id, len: pathLen}
          Game.spawns['Spawn1'].room.memory.allSources.push({id: sources[i].id, len: pathLen, safe: safe, slots: slots,miners: [], container: null});

      }
      Game.spawns['Spawn1'].room.memory.allSources.sort(function(a, b) {
          return (a.len-a.safe*100) - (b.len-b.safe*10);
      });
  }

  buildContainers.run();
  if (containers.length>=1) buildExtension.run()
  if (containers.length>=1&&extensions.length>=3) buildRoads.run();

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
