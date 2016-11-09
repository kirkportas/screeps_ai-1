var buildExtension = {
    place: function(x,y) {
      var returncode = Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x,Game.spawns['Spawn1'].pos.y+y,STRUCTURE_EXTENSION);
      if (returncode==ERR_FULL || returncode==ERR_RCL_NOT_ENOUGH) return false;
      if (returncode==0) {
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x+1,Game.spawns['Spawn1'].pos.y+y,STRUCTURE_ROAD);
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x-1,Game.spawns['Spawn1'].pos.y+y,STRUCTURE_ROAD);
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x,Game.spawns['Spawn1'].pos.y+y+1,STRUCTURE_ROAD);
        Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x+x,Game.spawns['Spawn1'].pos.y+y-1,STRUCTURE_ROAD);
      }
      return true;
    },
    canPlace: function(x,y) {

      var pos = Game.spawns['Spawn1'].pos;
      //console.log((Game.map.getTerrainAt(pos.x+x,pos.y+y,Game.spawns['Spawn1'].room.name)));
      return ((Game.map.getTerrainAt(pos.x+x,pos.y+y,Game.spawns['Spawn1'].room.name)=='plain')
      && (Game.map.getTerrainAt(pos.x+x+1,pos.y+y,Game.spawns['Spawn1'].room.name)=='plain')
      && (Game.map.getTerrainAt(pos.x+x-1,pos.y+y,Game.spawns['Spawn1'].room.name)=='plain')
      && (Game.map.getTerrainAt(pos.x+x,pos.y+y+1,Game.spawns['Spawn1'].room.name)=='plain')
      && (Game.map.getTerrainAt(pos.x+x,pos.y+y-1,Game.spawns['Spawn1'].room.name)=='plain'));
    },

    run: function() {

      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y+4,STRUCTURE_TOWER);
      Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y+6,STRUCTURE_TOWER);

      for (var i=0;i<100;i++) {
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
          y=-3+2*Math.floor(j/4);
        }
        if (i>=30 && i<=54) {
          var j=i-30;
          x=-4+(2*j)%10;
          y=-4+2*Math.floor(j/5);
        }

        if (x==0 && y>=0) continue; //Reserverer til containers/towers
        if (!buildExtension.canPlace(x,y)) continue; //Skips if 1/5 tile is wall or swamp
        if (!buildExtension.place(x,y)) break;
      }
    }



};
module.exports = buildExtension;
