var tasks = require('tasks');

var roleWarrior = {

    run: function(creep) {
      creep.say('t')
      var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
      if(targets.length > 0) {
          creep.rangedAttack(targets[0]);
      } else {
        var flag = Game.flags['Flag1'];
        creep.moveTo(flag.pos);
      }
    }
};

module.exports = roleWarrior;
