var buildExtension = require('build.extension');
var buildContainers = require('build.containers');
var buildRoads = require('build.roads');
var buildWalls = require('build.walls');
var roomLinks = require('room.links');

var mainRoom = {

    run: function(room) {

      roomLinks.run(room);

      var posSpawn = room.find(FIND_MY_SPAWNS)[0].pos;
      //var posSpawn = new RoomPosition(Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y+1, Game.spawns['Spawn1'].room.name);
      var sources = room.find(FIND_SOURCES);
      var lairs = room.find(FIND_STRUCTURES, {
              filter: (structure) => {
                  return (
                      structure.structureType == STRUCTURE_KEEPER_LAIR && structure.my == false )  }
      });

      if (room.memory.allSources===undefined || room.memory.allSources.length===undefined || room.memory.allSources.length===0) {
        console.log('init room');
        room.memory.allSources=[];

        for (var i = 0; i < sources.length; i++) {
            var path = posSpawn.findPathTo(sources[i],{range:1})
            var pathLen = path.length;
            var safe=1;
            var x=path[pathLen-1].x;
            var y=path[pathLen-1].y;

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

                 let items = room.lookAt(sources[i].pos.x+x1,sources[i].pos.y+y1);
                   for (let i=0;i<items.length;i++) {
                       if (items[i].terrain!='wall') {slots++;}
                   }
                }
            }

            //   {id: sources[i].id, len: pathLen}
            room.memory.allSources.push({id: sources[i].id, len: pathLen, safe: safe, slots: slots,miners: [], container: null});

        }
        room.memory.allSources.sort(function(a, b) {
            return (a.len-a.safe*100) - (b.len-b.safe*10);
        });
    }
    //buildWalls.run(room);
    if (room.memory.timeToRecheck===null) room.memory.timeToRecheck=0;
    room.memory.timeToRecheck-=1;
    if (room.memory.timeToRecheck<=0) {
      console.log('checking room');
      var extensions = room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
      var containers = room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }});
      //


      if (room.name=='E65S62') {
        room.memory.wallHitsMax=200000;
        room.memory.wallHitsmin=100000;
        room.memory.bufferenergy=100000;
        room.memory.roomdesign=1;
        room.memory.expand=true;
      } else if (room.name=='E65S61') {
        room.memory.wallHitsMax=200000;
        room.memory.wallHitsmin=100000;
        room.memory.bufferenergy=20000;
        room.memory.roomdesign=1;
        room.memory.expand=true;
      } else if (room.name=='E68S62') {
        room.memory.wallHitsMax=40000;
        room.memory.wallHitsmin=20000;
        room.memory.bufferenergy=20000;
        room.memory.roomdesign=2;
        room.memory.expand=true;
      } else {
        room.memory.wallHitsMax=20000;
        room.memory.wallHitsmin=10000;
        room.memory.bufferenergy=20000;
        room.memory.roomdesign=1;
        room.memory.expand=false;
      }

      if (room.memory.roomdesign==1) {
        buildContainers.run(room);
        if (containers.length>=1) buildExtension.run(room)
        if (containers.length>=1&&extensions.length>=3) buildRoads.run(room);
      }
      if (room.memory.roomdesign==2) {
        if (containers.length>=1&&extensions.length>=3) buildRoads.run(room);
      }

      room.memory.timeToRecheck=100;
      }
  }
};

module.exports = mainRoom;
