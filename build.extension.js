var buildExtension = {
    place: function(x,y) {
      var returncode = Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x,Game.spawns['Spawn1'].pos.y+y,STRUCTURE_EXTENSION);
      if (returncode==ERR_FULL || returncode==ERR_RCL_NOT_ENOUGH) return false;

      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x+1,Game.spawns['Spawn1'].pos.y+y,STRUCTURE_ROAD);
      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x-1,Game.spawns['Spawn1'].pos.y+y,STRUCTURE_ROAD);
      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x,Game.spawns['Spawn1'].pos.y+y+1,STRUCTURE_ROAD);
      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x,Game.spawns['Spawn1'].pos.y+y-1,STRUCTURE_ROAD);

      return true;
    },

    run: function() {

      for (var i=0;i<20;i++) {
        if (i>=0 && i<=3) {
          var j=i;
          var x=-1+(2*j)%4;
          var y=-1+2*Math.floor(j/2);
          buildExtension.place(x,y);
        }
        if (i>=4 && i<=13) {
          var j=i-4;
          var x=-2+(2*j)%6;
          var y=-2+2*Math.floor(j/4);
          buildExtension.place(x,y);
        }


      }


      /*
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
      */
        /*
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+2,Game.spawns['Spawn1'].pos.y,STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x-2,Game.spawns['Spawn1'].pos.y,STRUCTURE_EXTENSION);
        //Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x,Game.spawns['Spawn1'].pos.y+2,STRUCTURE_EXTENSION); //reservert av cont
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x,Game.spawns['Spawn1'].pos.y-2,STRUCTURE_EXTENSION);
        */
    }



};
module.exports = buildExtension;
