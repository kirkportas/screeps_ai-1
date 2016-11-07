var buildRoads = {
    run: function(room) {
        var posSpawn = new RoomPosition(Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y+1, Game.spawns['Spawn1'].room.name);
        var posRes = posSpawn.findClosestByRange(FIND_SOURCES);
        var posCtr = Game.spawns['Spawn1'].room.controller;


        // FJERNER ALLE VEIER
        /*
        var allRoads = room.find(FIND_CONSTRUCTION_SITES, {filter: { structureType: STRUCTURE_ROAD }});
        allRoads.forEach(road => road.remove());
        */
        // ----------------



        //BYGG VEI TIL sources
        var sources = Game.spawns['Spawn1'].room.memory.allSources;
        for (var i=0;i<sources.length;i++) {
          var source=sources[i];
          var path = posSpawn.findPathTo(Game.getObjectById(source.id),{range:1, ignoreCreeps: true});
          if (!path.incomplete) {
              for (i = 0; i < path.length; i++) {
                  let pos = path[i];
                  Game.spawns['Spawn1'].room.createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
              }
          }
        }

        //BYGG VEI TIL KONTROLLER
        var path = posSpawn.findPathTo(posCtr,{range:1, ignoreCreeps: true});
        if (!path.incomplete) {
            for (i = 0; i < path.length; i++) {
                let pos = path[i];
                Game.spawns['Spawn1'].room.createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
            }
        }


    }



};
module.exports = buildRoads;
