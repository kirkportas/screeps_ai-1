var prototypeRoom = require('prototype.room');

Creep.prototype.moveToOpt = function(target,opts) {
  if (this.fatigue>0) return;
  opts = opts || {};
  var creep=this;
  var curPos=this.pos;
  var oldPos=this.memory.oldPos;
  if (oldPos!=undefined&&curPos.x==oldPos.x&&curPos.y==oldPos.y) {
    if (this.memory.stuckTime) this.memory.stuckTime=this.memory.stuckTime+1; else this.memory.stuckTime=1;
    if (this.memory.stuckTime>=2) {
      this.say('stuck')
      console.log('stuck in ',this.room.name)
      delete this.memory._move;
      this.moveTo(target,opts);
    }

  } else {
      opts.reusePath = 200;
      opts.ignoreCreeps = true;
      this.memory.stuckTime=0;
      this.moveTo(target,{reusePath:200,ignoreCreeps:true});
  }

  this.memory.oldPos=curPos;
}
