var roomLinks = {
  run: function(room) {
    var sources = room.find(FIND_SOURCES);
    var linksSpawner =[]
    _.forEach(sources, function(source){
      var link=source.pos.findInRange(FIND_STRUCTURES,3,{filter: { structureType: STRUCTURE_LINK }})[0]
      if (link) linksSpawner.push(link)
    });

    var linkCentral = room.find(FIND_MY_SPAWNS)[0].pos.findInRange(FIND_STRUCTURES,5,{filter: { structureType: STRUCTURE_LINK }})[0]
    var linkUpgrader = room.controller.pos.findInRange(FIND_STRUCTURES,3,{filter: { structureType: STRUCTURE_LINK }})[0]

    console.log(linksSpawner+' '+linkCentral+' '+linkUpgrader)
  }
};
module.exports = roomLinks;
