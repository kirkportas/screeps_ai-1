var buildExtension = {
    run: function() {



        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+1,Game.spawns['Spawn1'].pos.y+1,STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x,Game.spawns['Spawn1'].pos.y+1,STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x-1,Game.spawns['Spawn1'].pos.y+1,STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+1,Game.spawns['Spawn1'].pos.y,STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x-1,Game.spawns['Spawn1'].pos.y,STRUCTURE_EXTENSION);

    }



};
module.exports = buildExtension;
