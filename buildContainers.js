var buildContainers = {
    run: function() {

        var posSpawn = new RoomPosition(Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y+1, Game.spawns['Spawn1'].room.name);
        var sources = Game.spawns['Spawn1'].room.memory.allSources;
        for (var s=0;s<sources.length;s++) {
          var source=sources[s];
          for (var x1=-1;x1<2;x1++) { //LOOP though spots around source
            for (var y1=-1;y1<2;y1++) {
              var c=0;
              var items = Game.spawns['Spawn1'].room.lookAt(source.pos.x+x1,source.pos.y+y1);
              for (let i=0;i<items.length;i++) {
                  if (items[i].terrain=='plain' || items[i].terrain=='swamp') {c++;}
              }
              console.log(c);

            }
          }
        }




    }

};
module.exports = buildContainers;
