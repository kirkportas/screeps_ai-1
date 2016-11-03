var buildRoads = {
    run: function() {
        var posSpawn = new RoomPosition(Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y+1, Game.spawns['Spawn1'].room.name);
        var posRes = posSpawn.findClosestByRange(FIND_SOURCES);
        var posCtr = Game.spawns['Spawn1'].room.controller;


        //BYGG VEI TIL NÆRMESTE SOURCE
        var path = new PathFinder.search(posSpawn,{pos:posRes,range:1});
        if (!path.incomplete) {
            for (i = 0; i < path.path.length; i++) {
                let pos = path.path[i];
                Game.spawns['Spawn1'].room.createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
            }
        }

        //BYGG VEI TIL KONTROLLER
        var path = new PathFinder.search(posSpawn,{pos:posCtr,range:1});
        if (!path.incomplete) {
            for (i = 0; i < path.path.length; i++) {
                let pos = path.path[i];
                Game.spawns['Spawn1'].room.createConstructionSite(pos.x,pos.y,STRUCTURE_ROAD);
            }
        }


    }



};
module.exports = buildRoads;
