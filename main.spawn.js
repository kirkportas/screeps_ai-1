var mainSpawn = {

    run: function() {

    global.findNextName = function(type) {
        var finaleName
        for (var i=1;true;i++) {
            if(!Game.creeps[type+i]) {
                finaleName=type+i;
                break;
            }
        }
        return finaleName;
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.ticksToLive>50).length;
    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler' && creep.ticksToLive>50).length;
    var harvestersBig = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvesterBig'&& creep.ticksToLive>50).length;
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader'&& creep.ticksToLive>50).length;
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder'&& creep.ticksToLive>50).length;

    var containers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }}).length;

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    //getObjectById('sss')
    var sources = Game.spawns['Spawn1'].room.memory.allSources;
    for (var i=0;i<sources.length;i++) {
      var source=sources[i];
      console.log('source ',i,'. Miners: ',source.miners.length,' / ',source.slots);
      if (source.miners.length<source.slots) {
        if (Game.spawns['Spawn1'].canCreateCreep([WORK,CARRY,MOVE] == OK)) {
          var preferedSource = source.id;
          var name = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], findNextName('harvester'), {role: 'harvester', pref:preferedSource});
          if(_.isString(name)) {
            source.miners.push(Memory.creeps[name].id);
            break;
          }

        }
      }

    }

     var energy = Game.spawns['Spawn1'].room.energyAvailable;

     /*
    if (energy>=200) {
        if(harvesters < 3) {
            var preferedSource = Game.spawns['Spawn1'].room.memory.allSources[0].id;
            console.log(preferedSource);
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], findNextName('harvester'), {role: 'harvester', pref:preferedSource});
        } else if(haulers < 1 && containers>=1) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], findNextName('hauler'), {role: 'hauler'});
        } else if(harvestersBig < 0 && energy>=300) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE], findNextName('harvesterBig'), {role: 'harvesterBig'});
            console.log('Spawning new big harvester: ' + newName);
        } else if(upgraders < 1) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], findNextName('upgrader'), {role: 'upgrader'});
            console.log('Spawning new upgrader: ' + newName);
        } else if(builders < 3) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], findNextName('builder'), {role: 'builder'});
            console.log('Spawning new builder: ' + newName);
        }
    }
    */

     }

};
module.exports = mainSpawn;
