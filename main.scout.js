var tasks = require('tasks');
var mainScout = {

    run: function(room) {
      if (room.memory.scout===undefined) {
        console.log('setting basic scout info');
        var exits =Game.map.describeExits(room.name);
        var rooms=[];
        if (exits[1] != undefined) rooms.push(exits[1]);
        if (exits[3] != undefined) rooms.push(exits[3]);
        if (exits[5] != undefined) rooms.push(exits[5]);
        if (exits[7] != undefined) rooms.push(exits[7]);
        room.memory.scout={}
        for (var i=0;i<rooms.length;i++) {
          room.memory.scout[rooms[i]]={timeSinceLastScout:-1, danger:-1,sources:{}};
        }

        /* HOW TO USE
        var test = room.memory.scout;
        for (var key in test) {
          if (test.hasOwnProperty(key)) {
            console.log(key + " -> " + test[key]);
          }
        }
        */

      }
      for (var key in room.memory.scout) {
        if (room.memory.scout.hasOwnProperty(key)) {
          room.memory.scout[key].timeSinceLastScout++;

          ///console.log(key + " -> " + test[key]);
        }
      }



     }
};
module.exports = mainScout;
