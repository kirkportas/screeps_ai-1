var buildWalls = {

    run: function(room) {

      var wallW = room.find(FIND_EXIT_BOTTOM);
      for (let i=0;i<wallW.length-1;i++) {
        console.log(i,' ',wallW[i].x)
        if (wallW[i].x+1!=wallW[i+1].x) console.log('new seg');
      }
    }
};
module.exports = buildWalls;
