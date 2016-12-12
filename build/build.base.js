var buildBase = {
    run: function(room) {
      if (room.controller.level>=6) {
        var minerals = room.find(FIND_MINERALS);
        _.forEach(minerals, function(mineral){
          room.createConstructionSite(mineral.pos,STRUCTURE_EXTRACTOR);
        });
      }
    }

    };
    module.exports = buildBase;
