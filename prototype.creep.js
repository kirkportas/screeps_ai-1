var prototypeRoom = require('prototype.room');

Creep.prototype.moveToOpt = function(target) {
  if (this.fatigue>0) return;
  var creep=this;
  var curPos=this.pos;
  var oldPos=this.memory.oldPos;
  if (oldPos!=undefined&&curPos.x==oldPos.x&&curPos.y==oldPos.y) {
    if (this.memory.stuckTime) this.memory.stuckTime=this.memory.stuckTime+1; else this.memory.stuckTime=1;
    if (this.memory.stuckTime>=2) {
      this.say('stuck')
      console.log('stuck in ',this.room.name)
      this.moveTo(target,{ignoreCreeps:false,reusePath:5});
      //this.moveTo(target,{ignoreCreeps:false,reusePath:5,plainCost: 2,swampCost: 4,costCallback: function(roomName) {return getCallback(roomName)}});
    }

  } else {
      this.memory.stuckTime=0;
      this.moveTo(target,{ignoreCreeps:true,reusePath:200});
  }
  this.memory.oldPos=curPos;
}
