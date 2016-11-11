var tasks = require('tasks');
var mainScout = {

    run: function(room) {
      if (true||room.memory.scout===undefined || room.memory.scout.length===undefined || room.memory.scout.length===0) {
        console.log('setting basic scout info');
        room.memory.scout=Game.map.describeExits(room.name);
      }




     }

};
module.exports = mainScout;
