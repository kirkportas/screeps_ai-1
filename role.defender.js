var tasks = require('tasks');

var roleDefender = {

    run: function(creep) {

      /*
      var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
      if(targets.length > 0) {
          allHostiles=_.sortBy(targets, t => t.hits);
          creep.rangedAttack(targets[0]);
        } */

        var targetClosest = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var targetsLowestHits = creep.pos.findInRange(FIND_HOSTILE_CREEPS,3);
        targetsLowestHits=_.sortBy(targetsLowestHits, creep => creep.hits);
        //MASS ATTACK CALC
        var targets1 = (creep.pos.findInRange(FIND_HOSTILE_CREEPS,1).length);
        var targets2 = (creep.pos.findInRange(FIND_HOSTILE_CREEPS,2).length)-targets1;
        var targets3 = (creep.pos.findInRange(FIND_HOSTILE_CREEPS,3).length)-targets2-targets1;
        var possibleDmg= targets1*10+targets2*4+targets1*1;
        console.log('pos dmg',possibleDmg);

        if (possibleDmg>10) {
          creep.rangedMassAttack();
        } else if (targetsLowestHits.length) {
          if (creep.rangedAttack(targetsLowestHits[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targetsLowestHits[0]);
          }
        }else  if (targetClosest) {
        if (creep.rangedAttack(targetClosest) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targetClosest);
        }
      } else {
        var flag = Game.flags['Flag1'];
        creep.moveTo(flag.pos);
      }
    }
};

module.exports = roleDefender;
