var roomLinks = {
  run: function(room) {
    var sources = room.find(FIND_SOURCES);
    var linksSource =[]
    _.forEach(sources, function(source){
      var link=source.pos.findInRange(FIND_STRUCTURES,3,{filter: { structureType: STRUCTURE_LINK }})[0];
      if (link) linksSource.push(link)
    });
    var linkCentral = room.find(FIND_MY_SPAWNS)[0].pos.findInRange(FIND_STRUCTURES,5,{filter: { structureType: STRUCTURE_STORAGE }})[0]
    var linkUpgrader = room.controller.pos.findInRange(FIND_STRUCTURES,3,{filter: { structureType: STRUCTURE_LINK }})[0]

    _.forEach(linksSource, function(sourceLink){
      var energy=sourceLink.energy;
      if (energy>200) {
        if (linkUpgrader && linkUpgrader.energy<600) {
          sourceLink.transferEnergy(linkUpgrader);
        } else if (linkCentral && linkCentral.energy<800) {
          sourceLink.transferEnergy(linkCentral);
        }
      }
    });
    if (linkCentral&&linkUpgrader) {
      if (linkCentral.energy>=400&&linkUpgrader<=200) {
        linkCentral.transferEnergy(linkUpgrader);
      }

    }
    //console.log(linksSpawner+' '+linkCentral+' '+linkUpgrader)
  }
};
module.exports = roomLinks;
