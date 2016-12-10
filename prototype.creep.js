var prototypeRoom = require('prototype.room');

Creep.prototype.moveToOpt = function(target) {
  var getCallback = function(roomName) {
      let room = Game.rooms[roomName];
      if (!room||room.isSourceKeeperRoom()) {console.log('skypped');return;}
      let costs = new PathFinder.CostMatrix;

      room.find(FIND_STRUCTURES).forEach(function(structure) {
        if (structure.structureType === STRUCTURE_ROAD) {
          // Favor roads over plain tiles
          costs.set(structure.pos.x, structure.pos.y, 1);
        } else if (structure.structureType !== STRUCTURE_CONTAINER &&
                   (structure.structureType !== STRUCTURE_RAMPART ||
                    !structure.my)) {
          // Can't walk through non-walkable buildings
          costs.set(structure.pos.x, structure.pos.y, 0xff);
        }
      });
      return costs;
  }
  if (this.fatigue>0) return;
  var creep=this;
  var curPos=this.pos;
  var oldPos=this.memory.oldPos;
  if (oldPos!=undefined&&curPos.x==oldPos.x&&curPos.y==oldPos.y) {
    if (this.memory.stuckTime) this.memory.stuckTime=this.memory.stuckTime+1; else this.memory.stuckTime=1;
    if (this.memory.stuckTime>=2) {
      this.say('stuck')
      console.log('stuck in ',this.room.name)

      this.moveTo(target,{ignoreCreeps:false,reusePath:5,plainCost: 2,swampCost: 4,costCallback: function(roomName) {return getCallback(roomName)}});
    }

  } else {
      this.memory.stuckTime=0;
      this.moveTo(target,{ignoreCreeps:true,reusePath:200,plainCost: 2,swampCost: 4,costCallback: function(roomName) {return getCallback(roomName)}});
  }
  this.memory.oldPos=curPos;
}
