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

      for (var i=0;i<29;i++) {
        var x=0;
        var y=0;

        if (i>=0 && i<=3) {
          var j=i;
          x=-1+(2*j)%4;
          y=-1+2*Math.floor(j/2);
        }
        if (i>=4 && i<=13) {
          var j=i-4;
          x=-2+(2*j)%6;
          y=-2+2*Math.floor(j/4);
        }
        if (i>=14 && i<=29) {
          var j=i-14;
          x=-3+(2*j)%8;
          y=-3+2*Math.floor(j/6);
        }
        if (x==0 && y>=0) continue; //Reserverer til containers/towers
        if (!buildExtension.place(x,y)) break;


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
