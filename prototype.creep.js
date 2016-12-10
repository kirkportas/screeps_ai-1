Creep.prototype.moveToOpt = function(target) {
  var getCallback= function(roomName) {
        let room = Game.rooms[roomName];
        if (!room) return;
        let costs = new PathFinder.CostMatrix;

        room.find(FIND_STRUCTURES).forEach(function(structure) {
          if (structure.structureType == STRUCTURE_WALL) {
            costs.set(structure.pos.x, structure.pos.y, 255);
          }
          if (structure.structureType == STRUCTURE_RAMPART) {
            costs.set(structure.pos.x, structure.pos.y, 1);
          }
        });
        return costs;
      }


  if (this.fatigue>0) return;
  var curPos=this.pos;
  var oldPos=this.memory.oldPos;
  if (oldPos!=undefined&&curPos.x==oldPos.x&&curPos.y==oldPos.y) {
    if (this.memory.stuckTime) this.memory.stuckTime=this.memory.stuckTime+1; else this.memory.stuckTime=1;
    if (this.memory.stuckTime>=2) {
      this.say('stuck')
      console.log('stuck in ',this.room.name)
      this.moveTo(target,{ignoreCreeps:false,reusePath:5,plainCost: 2,swampCost: 4,roomCallback: function(roomName) {return buildRoads.getCallback(roomName)}});
    }

  } else {
      this.memory.stuckTime=0;
      this.moveTo(target,{ignoreCreeps:true,reusePath:200,plainCost: 2,swampCost: 4,roomCallback: function(roomName) {return buildRoads.getCallback(roomName)}});
  }
  this.memory.oldPos=curPos;
}
