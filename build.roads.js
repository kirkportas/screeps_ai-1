var buildRoads = {

    getCallback: function(roomName) {
      let room = Game.rooms[roomName];
      if (!room) return;
      let costs = new PathFinder.CostMatrix;

      room.find(FIND_STRUCTURES).forEach(function(structure) {
        if (structure.structureType === STRUCTURE_ROAD) {
          costs.set(structure.pos.x, structure.pos.y, 1);
        } else if (structure.structureType == STRUCTURE_WALL) {
          costs.set(structure.pos.x, structure.pos.y, 255);
        }
      });
      return costs;
    },
    getCallbackDoubleroad: function(roomName) {
      let room = Game.rooms[roomName];
      if (!room) return;
      let costs = new PathFinder.CostMatrix;

      room.find(FIND_STRUCTURES).forEach(function(structure) {
        if (structure.structureType == STRUCTURE_WALL) {
          costs.set(structure.pos.x, structure.pos.y, 255);
          costs.set(structure.pos.x+1, structure.pos.y, 10);
          costs.set(structure.pos.x, structure.pos.y+1, 10);
        }
      });
      return costs;
    },
    buildRoad: function(pos1,pos2) {
      var path = new PathFinder.search(pos1,{pos:pos2,range:1},{plainCost: 1,swampCost: 1,roomCallback: function(roomName) {return buildRoads.getCallback(roomName)}} );
        for (i = 0; i < path.path.length; i++) {
            let pos = path.path[i];
            if (Game.rooms[pos.roomName]!=undefined) {
              Game.rooms[pos.roomName].createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
            } else console.log('undefined room ',pos.roomName);
        }
    },
    buildDoubleRoad: function(pos1,pos2) {
      var path = new PathFinder.search(pos1,{pos:pos2,range:1},{plainCost: 1,swampCost: 1,roomCallback: function(roomName) {return buildRoads.getCallbackDoubleroad(roomName)}} );
        for (i = 0; i < path.path.length; i++) {
            let pos = path.path[i];
            if (Game.rooms[pos.roomName]!=undefined) {
              Game.rooms[pos.roomName].createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
              Game.rooms[pos.roomName].createConstructionSite(pos.x-1,pos.y,STRUCTURE_ROAD);
              Game.rooms[pos.roomName].createConstructionSite(pos.x,pos.y-1,STRUCTURE_ROAD);
            } else console.log('undefined room ',pos.roomName);
        }
    },

    run: function(room) {
        var posSpawn = room.find(FIND_MY_SPAWNS)[0].pos;
        var posRes = posSpawn.findClosestByRange(FIND_SOURCES);
        var posCtr = room.controller.pos;

        // FJERNER ALLE VEIER
        if (false) {
          var allRoads = room.find(FIND_CONSTRUCTION_SITES, {filter: { structureType: STRUCTURE_ROAD }});
          allRoads.forEach(road => road.remove());
      }


        //BYGG VEI TIL sources
        var sources = room.memory.allSources;
        for (var i=0;i<sources.length;i++) {
          buildRoads.buildDoubleRoad(posSpawn,Game.getObjectById(sources[i].id).pos);
        }

        buildRoads.buildDoubleRoad(posSpawn,posCtr);

        //BYGG vei til kilder i trygge rom
        var scout=room.memory.scout;
        for (var key1 in scout) {
            if (scout[key1].danger==0) {
              var sources = scout[key1].sources;
              if ((Game.rooms[key1]!=undefined) && !Game.rooms[key1].find(FIND_MY_SPAWNS)[0]) shouldBuildRoadsToSpawns=true; else shouldBuildRoadsToSpawns=false;
              if (shouldBuildRoadsToSpawns) {
                for (var key2 in sources) {
                    var source = sources[key2];
                    var posX = source.pos.x;
                    var posY = source.pos.y;
                    var posRoom = key1;
                    var targetPos = new RoomPosition(posX,posY,posRoom);
                    buildRoads.buildRoad(posSpawn,targetPos);
                }
            } else if (Game.rooms[key1]){   //SHOULD BUILD ROAD TO OWN ROOM
              var target = Game.rooms[key1].find(FIND_MY_SPAWNS)[0];
              if (target) {
                buildRoads.buildRoad(posSpawn,target.pos);
              }

            }

            }


        }


    }



};
module.exports = buildRoads;
