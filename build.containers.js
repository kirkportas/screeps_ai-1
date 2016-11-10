var buildContainers = {
    run: function(room) {

        var posSpawn = room.find(FIND_MY_SPAWNS)[0].pos;
        //var posSpawn = new RoomPosition(Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y+1, Game.spawns['Spawn1'].room.name);
        room.createConstructionSite(posSpawn.x+2, posSpawn.y,STRUCTURE_CONTAINER)

        var sources = room.memory.allSources;
        for (var s=0;s<sources.length;s++) {
          var source=sources[s];
          var sourceObj = Game.getObjectById(source.id);
          var spots = [];
          var bestSpot=null;
          var bestSpotPoints=-1;
          for (var x1=-1;x1<2;x1++) { //LOOP though spots around source
            for (var y1=-1;y1<2;y1++) {
              var items = room.lookAt(sourceObj.pos.x+x1,sourceObj.pos.y+y1);
              for (let i=0;i<items.length;i++) {
                  if (items[i].terrain=='plain' || items[i].terrain=='swamp') {
                    var newPos = new RoomPosition(sourceObj.pos.x+x1,sourceObj.pos.y+y1,room.name);
                    if (!spots.includes(newPos)) {spots.push(newPos);}
                  }
              }
            }
          }
          for (var x1=-2;x1<3;x1++) { //LOOP though spots around source
            for (var y1=-2;y1<3;y1++) {
              var points=0;
              var newPos = new RoomPosition(sourceObj.pos.x+x1,sourceObj.pos.y+y1,room.name);
              //if (spots.includes(newPos)) { continue;}
              var items = Game.spawns['Spawn1'].room.lookAt(sourceObj.pos.x+x1,sourceObj.pos.y+y1);
              for (let i=0;i<items.length;i++) {
                  if (items[i].terrain=='plain' || items[i].terrain=='swamp') {
                  for (var ii=0;ii<spots.length;ii++) {
                    if (Math.abs(sourceObj.pos.x+x1-spots[ii].x)<2 && Math.abs(sourceObj.pos.y+y1-spots[ii].y)<2) {
                      if (sourceObj.pos.x+x1===spots[ii].x && sourceObj.pos.y+y1===spots[ii].y) {
                        continue;
                      }
                      points++;
                    }
                  }
                }
              }
              if (points>bestSpotPoints) {
                bestSpotPoints=points;
                bestSpot= new RoomPosition(sourceObj.pos.x+x1,sourceObj.pos.y+y1,room.name);
              }
            }
          }
          room.createConstructionSite(bestSpot.x,bestSpot.y,STRUCTURE_CONTAINER)
          //console.log(spots.length);
        }




    }

};
module.exports = buildContainers;
