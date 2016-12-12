var buildRoads = {

    getCallback: function(roomName) {
      let room = Game.rooms[roomName];
      if (!room) return;
      let costs = new PathFinder.CostMatrix;

      room.find(FIND_STRUCTURES).forEach(function(structure) {
        if (structure.structureType == STRUCTURE_WALL) {
          costs.set(structure.pos.x, structure.pos.y, 255);
        }
        if (structure.structureType == STRUCTURE_RAMPART) {
          costs.set(structure.pos.x, structure.pos.y, 1);
        }
      });
      return costs;
    },
    getCallbackDoubleroad: function(roomName) {
      let room = Game.rooms[roomName];
      if (!room) return;
      let costs = new PathFinder.CostMatrix;

      for (var y=0;y<50;y++) {
        for (var x=0;x<50;x++) {
          if (Game.map.getTerrainAt(x,y,roomName)=='wall') {
            costs.set(x,y,255);
            costs.set(x+1,y,10);
            costs.set(x,y+1,10);
          }
        }
      }

      room.find(FIND_STRUCTURES).forEach(function(structure) {
        if (structure.structureType == STRUCTURE_WALL) {
          costs.set(structure.pos.x, structure.pos.y, 255);
          //costs.set(structure.pos.x+1, structure.pos.y, costs.get(structure.pos.x+1, structure.pos.y)+64);
          //costs.set(structure.pos.x, structure.pos.y+1, costs.get(structure.pos.x, structure.pos.y+1)+64);
        }
      });


      return costs;
    },
    buildRoad: function(pos1,pos2,builtRoads) {
      //var builtRoads=[];
      var path = new PathFinder.search(pos1,{pos:pos2,range:1},{plainCost: 3,swampCost: 4,roomCallback: function(roomName) {return buildRoads.getCallback(roomName)}} );
        for (i = 0; i < path.path.length; i++) {
            let pos = path.path[i];
            if (pos.roomName==pos1.roomName) builtRoads.push(pos);
            if (Game.rooms[pos.roomName]!=undefined) {
              Game.rooms[pos.roomName].createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
            } else console.log('undefined room ',pos.roomName);
        }
    },
    buildRoadWithContainer: function(pos1,pos2,builtRoads) {
      var path = new PathFinder.search(pos1,{pos:pos2,range:1},{plainCost: 3,swampCost: 4,maxOps:4000,roomCallback: function(roomName) {return buildRoads.getCallback(roomName)}} );
        for (i = 0; i < path.path.length; i++) {
            let pos = path.path[i];
            if (pos.roomName==pos1.roomName) builtRoads.push(pos);
            if (Game.rooms[pos.roomName]!=undefined) {
              Game.rooms[pos.roomName].createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
              if (i == path.path.length -1 && i>2) {
                Game.rooms[pos.roomName].createConstructionSite(pos.x,pos.y,STRUCTURE_CONTAINER);
              }
            } else console.log('undefined room ',pos.roomName);
        }
    },
    buildDoubleRoad: function(pos1,pos2,builtRoads) {
      var path = new PathFinder.search(pos1,{pos:pos2,range:1},{plainCost: 1,swampCost: 1,roomCallback: function(roomName) {return buildRoads.getCallbackDoubleroad(roomName)}} );
        for (i = 0; i < path.path.length; i++) {
            let pos = path.path[i];
            if (pos.roomName==pos1.roomName) builtRoads.push(pos);
            if (Game.rooms[pos.roomName]!=undefined) {
              Game.rooms[pos.roomName].createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
              Game.rooms[pos.roomName].createConstructionSite(pos.x-1,pos.y,STRUCTURE_ROAD);
              Game.rooms[pos.roomName].createConstructionSite(pos.x,pos.y-1,STRUCTURE_ROAD);
            } else console.log('undefined room ',pos.roomName);
        }
    },

    run: function(room) {
        var builtRoads = [];
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
          buildRoads.buildDoubleRoad(posSpawn,Game.getObjectById(sources[i].id).pos,builtRoads);
        }

        buildRoads.buildDoubleRoad(posSpawn,posCtr,builtRoads);

        //BYGG vei til kilder i trygge rom
        var scout=room.memory.scout;
        for (var roomName in scout) {
            if (Memory.rooms[roomName]&&Memory.rooms[roomName].scoutFromOther&&Memory.rooms[roomName].scoutFromOther.danger==0&&Memory.rooms[roomName].scoutFromOther&&Memory.rooms[roomName].scoutFromOther.closestRoom==room.name) {
              var sources = Memory.rooms[roomName].scoutFromOther.sources;
              if ((Game.rooms[roomName]!=undefined) && !Game.rooms[roomName].find(FIND_MY_SPAWNS)[0]) shouldBuildRoadsToSpawns=true; else shouldBuildRoadsToSpawns=false;
              if (shouldBuildRoadsToSpawns) {
                for (var key2 in sources) {
                    var source = sources[key2];
                    var posX = source.pos.x;
                    var posY = source.pos.y;
                    var posRoom = roomName;
                    var targetPos = new RoomPosition(posX,posY,posRoom);
                    buildRoads.buildRoadWithContainer(posSpawn,targetPos,builtRoads);
                }
            } else if (Game.rooms[roomName]&&Memory.rooms[roomName].scoutFromOther.dist==1){   //SHOULD BUILD ROAD TO OWN ROOM
              var target = Game.rooms[roomName].find(FIND_MY_SPAWNS)[0];
              if (target) {
                buildRoads.buildRoad(posSpawn,target.pos,builtRoads);
              }

            }

            }


        }

        return builtRoads;
    }



};
module.exports = buildRoads;
