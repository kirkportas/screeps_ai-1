var buildWalls = {

    run: function(room) {

      var wallW = room.find(FIND_EXIT_RIGHT, {filter: (w) => {return (w.x==0)}});
      console.log(wallW.length)
    }
};
module.exports = buildWalls;
