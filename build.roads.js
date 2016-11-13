var buildRoads = {

    getCallback: function(roomName) {
      let room = Game.rooms[roomName];
      // In this example `room` will always exist, but since PathFinder
      // supports searches which span multiple rooms you should be careful!
      if (!room) return;
      let costs = new PathFinder.CostMatrix;

      room.find(FIND_STRUCTURES).forEach(function(structure) {
        if (structure.structureType === STRUCTURE_ROAD) {
          // Favor roads over plain tiles
          costs.set(structure.pos.x, structure.pos.y, 1);
        } else if (structure.structureType == STRUCTURE_WALL) {
          //console.log('fond wall')
          // Can't walk through non-walkable buildings
          costs.set(structure.pos.x, structure.pos.y, 255);
        }
      });

      return costs;
    },

    run: function(room) {
        var posSpawn = room.find(FIND_MY_SPAWNS)[0].pos;
        var posRes = posSpawn.findClosestByRange(FIND_SOURCES);
        var posCtr = room.controller;






        // FJERNER ALLE VEIER
        if (false) {
          var allRoads = room.find(FIND_CONSTRUCTION_SITES, {filter: { structureType: STRUCTURE_ROAD }});
          allRoads.forEach(road => road.remove());
      }
        // ----------------



        //BYGG VEI TIL sources
        var sources = room.memory.allSources;
        for (var i=0;i<sources.length;i++) {
          var source=sources[i];
          var path = posSpawn.findPathTo(Game.getObjectById(source.id),{range:1, ignoreCreeps: true, ignoreRoads: true});
          //if (!path.incomplete) {
              for (ii = 0; ii < path.length; ii++) {
                  let pos = path[ii];
                  room.createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
              }
          //}
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
              var sources = scout[key1].sources;
              if ((Game.rooms[key1]!=undefined) && !Game.rooms[key1].find(FIND_MY_SPAWNS)[0]) shouldBuildRoadsToSpawns=true; else shouldBuildRoadsToSpawns=false;
              if (shouldBuildRoadsToSpawns) {
                for (var key2 in sources) {
                  if (sources.hasOwnProperty(key2)) {
                    var source = sources[key2];
                    var posX = source.pos.x;
                    var posY = source.pos.y;
                    var posRoom = key1;
                    var targetPos = new RoomPosition(posX,posY,posRoom);
                    var path = new PathFinder.search(posSpawn,{pos:targetPos,range:1},{plainCost: 1,swampCost: 1,roomCallback: function(roomName) {return buildRoads.getCallback(roomName)}} );
                      if (path) {
                      for (i = 0; i < path.path.length; i++) {
                          let pos = path.path[i];
                          if (Game.rooms[pos.roomName]!=undefined) {
                            Game.rooms[pos.roomName].createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
                          } else {console.log('undefined');}
                      }
                    }
                  }
                }
            } else {   //SHOULD BUILD ROAD TO OWN ROOM
              var path = new PathFinder.search(posSpawn,targetPos,{range:1, ignoreCreeps: true, ignoreDestructibleStructures:false});


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
