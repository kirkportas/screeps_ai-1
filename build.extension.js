var buildExtension = {
    place: function(x,y) {
      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x,Game.spawns['Spawn1'].pos.y+y,STRUCTURE_EXTENSION);

      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x+1,Game.spawns['Spawn1'].pos.y+y,STRUCTURE_ROAD);
      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x-1,Game.spawns['Spawn1'].pos.y+y,STRUCTURE_ROAD);
      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x,Game.spawns['Spawn1'].pos.y+y+1,STRUCTURE_ROAD);
      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x,Game.spawns['Spawn1'].pos.y+y-1,STRUCTURE_ROAD);
    },

    run: function() {



      //innerste runde
      buildExtension.place(1,1);
      buildExtension.place(-1,1);
      buildExtension.place(1,-1);
      buildExtension.place(-1,-1);

      //andre rundep
      buildExtension.place(2,2);
      buildExtension.place(-2,2);
      buildExtension.place(2,-2);
      buildExtension.place(-2,-2);
        /*
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+2,Game.spawns['Spawn1'].pos.y,STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x-2,Game.spawns['Spawn1'].pos.y,STRUCTURE_EXTENSION);
        //Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x,Game.spawns['Spawn1'].pos.y+2,STRUCTURE_EXTENSION); //reservert av cont
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x,Game.spawns['Spawn1'].pos.y-2,STRUCTURE_EXTENSION);
        */
    }



};
module.exports = buildExtension;
