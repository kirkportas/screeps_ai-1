var tasks = require('tasks');

var roleWarrior = {

    run: function(creep) {

      var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        if (creep.rangedAttack(closestHostile)==ERR_NOT_IN_RANGE) {
          creep.moveTo(closestHostile);
          creep.say('closer');
        }
      } else {
        var flag = Game.flags['Flag1'];
        creep.moveTo(flag.pos);
      }

    }
};

module.exports = roleWarrior;
