var buildExtension = {
    place: function(x,y) {
      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+1,Game.spawns['Spawn1'].pos.y+1,STRUCTURE_EXTENSION);
    },

    run: function() {



      //innerste runde
      buildExtension.place(1,1);
      //Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+1,Game.spawns['Spawn1'].pos.y+1,STRUCTURE_EXTENSION);
      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x-1,Game.spawns['Spawn1'].pos.y+1,STRUCTURE_EXTENSION);
      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+1,Game.spawns['Spawn1'].pos.y-1,STRUCTURE_EXTENSION);
      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x-1,Game.spawns['Spawn1'].pos.y-1,STRUCTURE_EXTENSION);

      //andre rundep
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+2,Game.spawns['Spawn1'].pos.y+2,STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x-2,Game.spawns['Spawn1'].pos.y+2,STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+2,Game.spawns['Spawn1'].pos.y-2,STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x-2,Game.spawns['Spawn1'].pos.y-2,STRUCTURE_EXTENSION);
        /*
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+2,Game.spawns['Spawn1'].pos.y,STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x-2,Game.spawns['Spawn1'].pos.y,STRUCTURE_EXTENSION);
        //Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x,Game.spawns['Spawn1'].pos.y+2,STRUCTURE_EXTENSION); //reservert av cont
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x,Game.spawns['Spawn1'].pos.y-2,STRUCTURE_EXTENSION);
        */
    }



};
module.exports = buildExtension;
