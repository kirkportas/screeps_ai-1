var tasks = require('tasks');
var mainScout = {

    run: function(room) {
      if (true||room.memory.scout===undefined) {
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
