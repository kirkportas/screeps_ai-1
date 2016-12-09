Creep.prototype.moveToOpt = function(target) {

  var curPos=this.pos;
  var oldPos=this.memory.oldPos;
  if (oldPos!=undefined&&curPos.x==oldPos.x&&curPos.y==oldPos.y&&this.fatigue==0) {
    if (this.memory.stuckTime) this.memory.stuckTime=this.memory.stuckTime+1; else this.memory.stuckTime=1;
    if (this.memory.stuckTime>=3) {
      this.say('stuck')
      console.log('stuck in ',this.room.name)
      this.moveTo(target,{ignoreCreeps:false,reusePath:5});
    }

  } else {
      this.memory.stuckTime=0;
      this.moveTo(target,{ignoreCreeps:true,reusePath:100});
  }
  this.memory.oldPos=curPos;
}
