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
    var scoutsN = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout'&& creep.memory.targetRoom == 'E65S61' && creep.ticksToLive>50).length;
    var scoutsS = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout'&& creep.memory.targetRoom == 'E65S63' && creep.ticksToLive>50).length;

    var spawn = Game.spawns['Spawn1'];
    var containers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }}).length;
    var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,5, {  filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) }})[0];
    var energyNeeded = 0;
    var repairNeeded = 0;
    var constructionSites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
    constructionSites.forEach(site => energyNeeded+=(site.progressTotal-site.progress));
    var structures = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES);
    _.forEach(structures, function(struc){
      if (struc.hitsMax!==undefined && struc.hits<struc.hitsMax*0.5 && struc.structureType!=STRUCTURE_WALL && struc.structureType!=STRUCTURE_RAMPART) {
        repairNeeded+= (struc.hitsMax*0.75-struc.hits)
        //console.log('hp: ',struc.hits,'/',struc.hitsMax);
    }
    });


    var buildersNeeded = Math.min(5,Math.max(1,Math.ceil( (energyNeeded/2000) + (repairNeeded/100000) )));
    console.log(constructionSites.length,' sites need energy: ', energyNeeded,' by builders: ',buildersNeeded,'. Damage to repair: ',repairNeeded);


    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    //cleanup dedicated miners
    var sources = Game.spawns['Spawn1'].room.memory.allSources;
    for (var i=0;i<sources.length;i++) {
      var source=sources[i];

      for (var ii=0;ii<source.miners.length;ii++) {
        if (Game.getObjectById(source.miners[ii]) == null) {
        console.log('dedicated miner died. Remove');
        source.miners.splice(ii, 1);
      }
    }
      //spawns harvesters per source
      var energyAvav = Game.spawns['Spawn1'].room.energyCapacityAvailable;
      //console.log(energyAvav);
      if (energyAvav>=700) {
        //console.log(Game.getObjectById(source.miners[0]).ticksToLive);
        if ((source.miners.length<1 || (source.miners.length==1 && Game.getObjectById(source.miners[0]).ticksToLive<200) && source.safe)) {
          if (Game.spawns['Spawn1'].canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE] == OK)) {
            var preferedSource = source.id;
            var name = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], findNextName('harvester'), {role: 'harvester', pref:preferedSource});
            console.log(name);
            if(_.isString(name)) {break;}
          }
        }
      } else {
        if (source.miners.length<source.slots && source.safe) {
          if (Game.spawns['Spawn1'].canCreateCreep([WORK,WORK,CARRY,MOVE] == OK)) {
            var preferedSource = source.id;
            var name = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE], findNextName('harvester'), {role: 'harvester', pref:preferedSource});
            if(_.isString(name)) {break;}
          }
        }
      }

    }

  if (containers>=1) {
    if(haulers < 3) {
        var energyAvav = Game.spawns['Spawn1'].room.energyCapacityAvailable;
        var modulesOfEach = Math.min(6,Math.floor(energyAvav/100));
        var modules=[];
        for (var m=0;m<modulesOfEach;m++) {modules.push(CARRY);}
        for (var m=0;m<modulesOfEach;m++) {modules.push(MOVE);}
        var newName = Game.spawns['Spawn1'].createCreep(modules, findNextName('hauler'), {role: 'hauler'});
        console.log('Spawning new hauler: ' + newName);
    } else  if(builders < buildersNeeded) {
      var energyAvav = Game.spawns['Spawn1'].room.energyCapacityAvailable;
      var modulesOfEach = Math.min(5,Math.floor(energyAvav/200));
      var modules=[];
      for (var m=0;m<modulesOfEach;m++) {modules.push(WORK);}
      for (var m=0;m<modulesOfEach;m++) {modules.push(CARRY);}
      for (var m=0;m<modulesOfEach;m++) {modules.push(MOVE);}
      var newName = Game.spawns['Spawn1'].createCreep(modules, findNextName('builder'), {role: 'builder'});
      console.log('Spawning new builder: ' + newName);
    } else if(upgraders < 1 || (centralContainer.store[RESOURCE_ENERGY]>1500 && upgraders<4)) {
      var energyAvav = Game.spawns['Spawn1'].room.energyCapacityAvailable;
      var modulesOfEach = Math.min(5,Math.floor(energyAvav/200));
      var modules=[];
      for (var m=0;m<modulesOfEach;m++) {modules.push(WORK);}
      for (var m=0;m<modulesOfEach;m++) {modules.push(CARRY);}
      for (var m=0;m<modulesOfEach;m++) {modules.push(MOVE);}
      var newName = Game.spawns['Spawn1'].createCreep(modules, findNextName('upgrader'), {role: 'upgrader'});
      console.log('Spawning new upgrader: ' + newName);
    } else if(scoutsN < 3) {
      var newName = Game.spawns['Spawn1'].createCreep([MOVE,MOVE,CARRY,WORK], findNextName('scout'), {role: 'scout', delivered: 0, startRoom: Game.spawns['Spawn1'].room,targetRoom:'E65S61'});
      console.log('Spawning new scout: ' + newName);
    } else if(scoutsS < 1) {
      var newName = Game.spawns['Spawn1'].createCreep([MOVE,MOVE,CARRY,WORK], findNextName('scout'), {role: 'scout', delivered: 0, startRoom: Game.spawns['Spawn1'].room,targetRoom:'E65S63'});
      console.log('Spawning new scout: ' + newName);
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
