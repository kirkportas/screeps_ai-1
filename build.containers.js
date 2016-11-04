var buildContainers = {
    run: function() {

        var posSpawn = new RoomPosition(Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y+1, Game.spawns['Spawn1'].room.name);
        var sources = Game.spawns['Spawn1'].room.memory.allSources;
        for (var i=0;i<sources.length;i++) {
          var source=sources[i];
          var posRes = Game.getObjectById(source.id).pos;

          //BYGG VEI TIL NÆRMESTE SOURCE
          var path = new PathFinder.search(posSpawn,{pos:posRes,range:1});
          if (!path.incomplete) {

              //Resursholder
              let bestPosX = -1;
              let bestPosY = -1;
              for (i = 0; i < path.path.length; i++) {
                  let pos = path.path[i];

                  for (let x2=-1;x2<2;x2++) {
                      for (let y2=-1;y2<2;y2++) {

                          let c = 0;
                          for (let x1=-1;x1<2;x1++) {
                              for (let y1=-1;y1<2;y1++) {

                               let items = Game.spawns['Spawn1'].room.lookAt(pos.x+x1+x2,pos.y+y1+y2);
                                 for (let i=0;i<items.length;i++) {
                                     if (items[i].terrain=='plain') {c++;}
                                     //TODO: LEgg inn sjekk om det er en struktur
                                 }
                              }
                          }
                          if (c==9) {
                              //Game.spawns['Spawn1'].room.createConstructionSite(pos.x+x2,pos.y+y2,STRUCTURE_ROAD);
                              bestPosX=pos.x+x2;
                              bestPosY=pos.y+y2;
                          }
                      }
                  }

              }
              if (bestPosX>0&&bestPosY>0)Game.spawns['Spawn1'].room.createConstructionSite(bestPosX,bestPosY,STRUCTURE_CONTAINER);

          }
        }




    }

};
module.exports = buildContainers;
