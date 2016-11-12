var buildRoads = {
    run: function(room) {
        var posSpawn = room.find(FIND_MY_SPAWNS)[0].pos;
        var posRes = posSpawn.findClosestByRange(FIND_SOURCES);
        var posCtr = room.controller;


        // FJERNER ALLE VEIER
        /*
        var allRoads = room.find(FIND_CONSTRUCTION_SITES, {filter: { structureType: STRUCTURE_ROAD }});
        allRoads.forEach(road => road.remove());
        */
        // ----------------



        //BYGG VEI TIL sources
        var sources = room.memory.allSources;
        for (var i=0;i<sources.length;i++) {
          var source=sources[i];
          var path = posSpawn.findPathTo(Game.getObjectById(source.id),{range:1, ignoreCreeps: true, ignoreRoads: true});
          if (!path.incomplete) {
              for (i = 0; i < path.length; i++) {
                  let pos = path[i];
                  room.createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
              }
          }
        }

        //BYGG VEI TIL KONTROLLER
        var path = posSpawn.findPathTo(posCtr,{range:1, ignoreCreeps: true});
        if (!path.incomplete) {
            for (i = 0; i < path.length; i++) {
                let pos = path[i];
                room.createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
            }
        }

        //BYGG vei til kilder i trygge rom
        var scout=room.memory.scout;
        for (var key1 in scout) {
          if (scout.hasOwnProperty(key1)) {
            if (scout[key1].danger==0) {
              console.log('found a safe room');
              var sources = scout[key1].sources;
              for (var key2 in sources) {
                if (sources.hasOwnProperty(key2)) {
                  var source = sources[key2];
                  var posX = source.pos.x;
                  var posY = source.pos.y;
                  var posRoom = key1;
                  console.log(key1);
                  var targetPos = new RoomPosition(posX,posY,posRoom);
                  console.log(posX,' ',posY,' ',posRoom,' ',targetPos);
                  //var path = posSpawn.findPathTo(targetPos,{range:1, ignoreCreeps: true});
                  var path = new PathFinder.search(posSpawn,targetPos,{range:1, ignoreCreeps: true});
                    if (!path.incomplete) {
                    for (i = 0; i < path.length; i++) {
                        let pos = path[i];
                        Memory.test=pos;
                        //pos.roomName.createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
                    }
                  }
                }
              }

            }


            ///console.log(key + " -> " + test[key]);
          }
        }

        /*
        //BYgg vei nord til E65S61
        var exitDir = Game.map.findExit(room.name, 'E65S61');
        var exit = posSpawn.findClosestByRange(exitDir);
        var path = posSpawn.findPathTo(exit,{range:1, ignoreCreeps: true});
        if (!path.incomplete) {
            for (i = 0; i < path.length; i++) {
                let pos = path[i];
                room.createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
            }
        }
        //BYgg vei sør til E65S63
        var exitDir = Game.map.findExit(room.name, 'E65S63');
        var exit = posSpawn.findClosestByRange(exitDir);
        var path = posSpawn.findPathTo(exit,{range:1, ignoreCreeps: true});
        if (!path.incomplete) {
            for (i = 0; i < path.length; i++) {
                let pos = path[i];
                room.createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
            }
        }
        */


    }



};
module.exports = buildRoads;
