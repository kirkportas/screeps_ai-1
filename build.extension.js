var buildExtension = {
    place: function(posSpawn,x,y) {
      var returncode = Game.spawns['Spawn1'].room.createConstructionSite(posSpawn.x+x,posSpawn.y+y,STRUCTURE_EXTENSION);
      if (returncode==ERR_FULL || returncode==ERR_RCL_NOT_ENOUGH) return false;
      if (returncode==0) {
        room.createConstructionSite(posSpawn.x+x+1,posSpawn.y+y,STRUCTURE_ROAD);
        room.createConstructionSite(posSpawn.x+x-1,posSpawn.y+y,STRUCTURE_ROAD);
        room.createConstructionSite(posSpawn.x+x,posSpawn.y+y+1,STRUCTURE_ROAD);
        room.createConstructionSite(posSpawn.x+x,posSpawn.y+y-1,STRUCTURE_ROAD);
      }
      return true;
    },
    canPlace: function(posSpawn,x,y) {

      //console.log((Game.map.getTerrainAt(pos.x+x,pos.y+y,Game.spawns['Spawn1'].room.name)));
      return ((Game.map.getTerrainAt(posSpawn.x+x,posSpawn.y+y,room.name)!='wall')
      && (Game.map.getTerrainAt(posSpawn.x+x+1,posSpawn.y+y,room.name)!='wall')
      && (Game.map.getTerrainAt(posSpawn.x+x-1,posSpawn.y+y,room.name)!='wall')
      && (Game.map.getTerrainAt(posSpawn.x+x,posSpawn.y+y+1,room.name)!='wall')
      && (Game.map.getTerrainAt(posSpawn.x+x,posSpawn.y+y-1,room.name)!='wall'));
    },

    run: function() {
      var posSpawn = room.find(FIND_MY_SPAWNS)[0].pos;

      room.createConstructionSite(posSpawn.x, posSpawn.y+4,STRUCTURE_TOWER);
      room.createConstructionSite(posSpawn.x, posSpawn.y+6,STRUCTURE_TOWER);

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
        if (!buildExtension.canPlace(posSpawn,x,y)) continue; //Skips if 1/5 tile is wall or swamp
        if (!buildExtension.place(posSpawn,x,y)) break;
      }
    }



};
module.exports = buildExtension;
