var tasks = require('tasks');
var mainScout = {

    run: function(room) {
      if (room.memory.scout===undefined||room.name=='sE68S62') {
        console.log('setting basic scout info');
        var exits =Game.map.describeExits(room.name);
        var rooms=[]; //
        var rooms2=[];
        if (exits[1] != undefined) rooms.push(exits[1]);
        if (exits[3] != undefined) rooms.push(exits[3]);
        if (exits[5] != undefined) rooms.push(exits[5]);
        if (exits[7] != undefined) rooms.push(exits[7]);
        room.memory.scout={}
        for (var i=0;i<rooms.length;i++) {
          room.memory.scout[rooms[i]]={dist:1,timeSinceLastScout:-1,timeSinceLastScout:-1, danger:-1,sources:{}};

          var exits2 =Game.map.describeExits(rooms[i]);
          if (exits2[1] != undefined) if (!(exits2[1] in rooms2)) rooms2.push(exits2[1]);
          if (exits2[3] != undefined) if (!(exits2[3] in rooms2)) rooms2.push(exits2[3]);
          if (exits2[5] != undefined) if (!(exits2[5] in rooms2)) rooms2.push(exits2[5]);
          if (exits2[7] != undefined) if (!(exits2[7] in rooms2)) rooms2.push(exits2[7]);

        }
        console.log('-----')
        for (var i=rooms.length;i<rooms2.length+rooms.length;i++) {
          console.log(rooms2[i]);
          //room.memory.scout[rooms[rooms.length+i]]={dist:2,timeSinceLastScout:-1,timeSinceLastScout:-1, danger:-1,sources:{}};
        }


      }
      /*
      for (var key in room.memory.scout) {
        if (room.memory.scout[key].timeSinceLastScout!=-1) {
          room.memory.scout[key].timeSinceLastScout++;
        }
        if (!room.memory.scout[key].timeSinceLastFullScout || room.memory.scout[key].timeSinceLastFullScout!=-1) { //TODO: fjerne !timeSinceLastFullScout
          room.memory.scout[key].timeSinceLastFullScout++;
        }
      } */



     }
};
module.exports = mainScout;
