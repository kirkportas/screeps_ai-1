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
          //room.memory.scout.rooms.test=1;
          room.memory.scout[rooms[i]]={timeSinceLastScout:-1, danger:-1,sources:{}};
          //room.memory.scout.push({roomname:rooms[i],timeSinceLastScout:0, danger:0,sources:[]});
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




     }

};
module.exports = mainScout;
