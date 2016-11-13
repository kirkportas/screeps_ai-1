var tasks = require('tasks');

var roleDefender = {

    run: function(creep) {

      /*
      var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
      if(targets.length > 0) {
          allHostiles=_.sortBy(targets, t => t.hits);
          creep.rangedAttack(targets[0]);
        } */

        var flag = Game.flags['Flag1'];
        var targetClosest = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var targetsLowestHits = creep.pos.findInRange(FIND_HOSTILE_CREEPS,3);
        targetsLowestHits=_.sortBy(targetsLowestHits, creep => creep.hits);
        //MASS ATTACK CALC
        var targets1 = (creep.pos.findInRange(FIND_HOSTILE_CREEPS,1).length);
        var targets2 = (creep.pos.findInRange(FIND_HOSTILE_CREEPS,2).length)-targets1;
        var targets3 = (creep.pos.findInRange(FIND_HOSTILE_CREEPS,3).length)-targets2-targets1;
        var possibleDmg= targets1*10+targets2*4+targets3*1;
        console.log('pos dmg',possibleDmg,' tot targets: ',targets1,' ',targets2,' ',targets3);
        if (possibleDmg>10) {
          creep.rangedMassAttack();
        } else if (targetsLowestHits.length) {
          if (creep.rangedAttack(targetsLowestHits[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targetsLowestHits[0]);
          }
        } else if (targetClosest) {
        if (creep.rangedAttack(targetClosest) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targetClosest);
        }
      } else if (creep.memory.spawnerAction.localeCompare('KILL')) {
          var spawn=creep.room.find(FIND_MY_SPAWNS)[0];
          if (spawn) {
            creep.moveTo(spawn);
          }
        } else if (flag!=undefined && flag.pos.roomName==creep.memory.homeRoom) {
          creep.moveTo(flag.pos);
        } else {
          creep.moveTo(creep.room.controller);
        }

    }
};

module.exports = roleDefender;
