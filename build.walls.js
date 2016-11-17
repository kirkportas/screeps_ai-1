var buildWalls = {

    run: function(room) {

      var wallW = room.find(FIND_STRUCTURES, {filter: { x: 1 }});
      console.log(wallW.length)
    }
};
module.exports = buildWalls;
