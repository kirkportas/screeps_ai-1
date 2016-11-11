var tasks = require('tasks');
var mainScout = {

    run: function(room) {
      if (true||room.memory.scout===undefined || room.memory.scout.length===undefined || room.memory.scout.length===0) {
        //console.log('setting basic scout info');
        var exits =Game.map.describeExits(room.name);
        var rooms=[];
        if (exits[1] != undefined) rooms.push(exits[1]);
        if (exits[3] != undefined) rooms.push(exits[3]);
        if (exits[5] != undefined) rooms.push(exits[5]);
        if (exits[7] != undefined) rooms.push(exits[7]);
        room.memory.scout=[];
        for (var i=0;i<rooms.length;i++) {
          room.memory.scout.push(rooms[i]);
          room.memory.scout.push({roomname:rooms[i],timeSinceLastScout:0, danger:0,sources:[]});
        }


      }




     }

};
module.exports = mainScout;
