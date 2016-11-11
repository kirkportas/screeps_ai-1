var tasks = require('tasks');
var mainScout = {

    run: function(room) {
      if (true||room.memory.scout===undefined || room.memory.scout.length===undefined || room.memory.scout.length===0) {
        //console.log('setting basic scout info');
        var exits =Game.map.describeExits(room.name);
        console.log(exits[1].name);
        console.log(exits[3].name);
        console.log(exits[5].name);
        console.log(exits[7].name);
        room.memory.scout=exits;

      }




     }

};
module.exports = mainScout;
