var buildWalls = {

    run: function(room) {

      var wallW = room.find(FIND_STRUCTURES, {filter: { x: 0 }});
      console.log(wallW.lenght)

};
module.exports = buildWalls;
