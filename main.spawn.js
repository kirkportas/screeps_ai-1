var tasks = require('tasks');
var mainSpawn = {

    run: function(spawn) {

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
    var warriors = _.filter(Game.creeps, (creep) => creep.memory.role == 'warrior').length;

    var containers = spawn.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }}).length;
    //var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,5, {  filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) }})[0];
    var centralContainer = tasks.getCentralStorage(spawn);
    console.log('cont: ',centralContainer);
    var energyNeeded = 0;
    var repairNeeded = 0;
    var constructionSites = spawn.room.find(FIND_CONSTRUCTION_SITES);
    constructionSites.forEach(site => energyNeeded+=(site.progressTotal-site.progress));
    var structures = spawn.room.find(FIND_STRUCTURES);
    _.forEach(structures, function(struc){
      if (struc.hitsMax!==undefined && struc.hits<struc.hitsMax*0.5 && struc.structureType!=STRUCTURE_WALL && struc.structureType!=STRUCTURE_RAMPART) {
        repairNeeded+= (struc.hitsMax*0.75-struc.hits)
      }
      if (struc.hitsMax!==undefined && struc.hits<spawn.room.memory.wallHitsmin && (struc.structureType==STRUCTURE_WALL || struc.structureType==STRUCTURE_RAMPART)) {
        repairNeeded+= (spawn.room.memory.wallHitsMax-struc.hits)
      }
    });

    var energyPerBuilder=6000;
    var buildersNeeded = Math.min(3,Math.max(0,Math.ceil( (energyNeeded/energyPerBuilder) + (repairNeeded/(energyPerBuilder*20)) )));
    console.log(constructionSites.length,' sites need energy: ', energyNeeded,' by builders: ',buildersNeeded,'. Damage to repair: ',repairNeeded);


    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    //cleanup dedicated miners
    var sources = spawn.room.memory.allSources;
    Memory.test=sources;
    for (var i=0;i<sources.length;i++) {
      var source=sources[i];

      for (var ii=0;ii<source.miners.length;ii++) {
        if (Game.getObjectById(source.miners[ii]) == null) {
        console.log('dedicated miner died. Remove');
        source.miners.splice(ii, 1);
      }
    }
      //spawns harvesters per source
      var energyAvav = spawn.room.energyCapacityAvailable;
      //console.log(energyAvav);
      if (energyAvav>=700) {
        //console.log(Game.getObjectById(source.miners[0]).ticksToLive);
        if ((source.miners.length<1 || (source.miners.length==1 && Game.getObjectById(source.miners[0]).ticksToLive<200) && source.safe)) {
          if (spawn.canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE] == OK)) {
            var preferedSource = source.id;
            var name = spawn.createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], findNextName('harvester'), {role: 'harvester', pref:preferedSource});
            console.log(name);
            if(_.isString(name)) {break;}
          }
        }
      } else {
        if (source.miners.length<source.slots && source.safe) {
          if (spawn.canCreateCreep([WORK,WORK,CARRY,MOVE] == OK)) {
            var preferedSource = source.id;
            var name = spawn.createCreep([WORK,WORK,CARRY,MOVE], findNextName('harvester'), {role: 'harvester', pref:preferedSource});
            if(_.isString(name)) {break;}
          }
        }
      }

    }

  if (containers>=1) {
    if(haulers < 2) {
        var energyAvav = spawn.room.energyCapacityAvailable;
        var modulesOfEach = Math.min(6,Math.floor(energyAvav/100));
        var modules=[];
        for (var m=0;m<modulesOfEach;m++) {modules.push(CARRY);}
        for (var m=0;m<modulesOfEach;m++) {modules.push(MOVE);}
        var newName = spawn.createCreep(modules, findNextName('hauler'), {role: 'hauler'});
        console.log('Spawning new hauler: ' + newName);
    } else  if(builders < buildersNeeded) {
      var energyAvav = spawn.room.energyCapacityAvailable;
      var modulesOfEach = Math.min(5,Math.floor(energyAvav/200));
      var modules=[];
      for (var m=0;m<modulesOfEach;m++) {modules.push(WORK);}
      for (var m=0;m<modulesOfEach;m++) {modules.push(CARRY);}
      for (var m=0;m<modulesOfEach;m++) {modules.push(MOVE);}
      var newName = spawn.createCreep(modules, findNextName('builder'), {role: 'builder'});
      console.log('Spawning new builder: ' + newName);
    } else if(upgraders < 1 || ((centralContainer.store[RESOURCE_ENERGY]>centralContainer.storeCapacity*0.75 || centralContainer.store[RESOURCE_ENERGY]>10000) && upgraders<6)) {
      var energyAvav = spawn.room.energyCapacityAvailable;
      var modulesOfEach = Math.min(5,Math.floor(energyAvav/200));
      var modules=[];
      for (var m=0;m<modulesOfEach;m++) {modules.push(WORK);}
      for (var m=0;m<modulesOfEach;m++) {modules.push(CARRY);}
      for (var m=0;m<modulesOfEach;m++) {modules.push(MOVE);}
      var newName = spawn.createCreep(modules, findNextName('upgrader'), {role: 'upgrader'});
      console.log('Spawning new upgrader: ' + newName);
    } else if(scoutsN < 0) {
      var newName = spawn.createCreep([MOVE,MOVE,MOVE,CARRY,CARRY,WORK], findNextName('scout'), {role: 'scout', delivered: 0, startRoom: spawn.room.name,targetRoom:'E65S61'});
      console.log('Spawning new scout: ' + newName);
    } else if(scoutsS < 0) {
      var newName = spawn.createCreep([MOVE,MOVE,MOVE,CARRY,CARRY,WORK], findNextName('scout'), {role: 'scout', delivered: 0, startRoom: spawn.room.name,targetRoom:'E65S63'});
      console.log('Spawning new scout: ' + newName);
    } else if(warriors < 0) {
      var newName = spawn.createCreep([MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK], findNextName('warrior'), {role: 'warrior'});
      console.log('Spawning new warrior: ' + newName);
    }
  }

  var creep = spawn.pos.findClosestByRange(FIND_CREEPS,1);
  if (creep && creep.memory.role=='builder' && buildersNeeded==0) {
    spawn.recycleCreep(creep);
  } else if (creep && creep.ticksToLive<1000) {
    spawn.renewCreep(creep);
  }
  var hostileSpawn = spawn.pos.findClosestByRange(FIND_HOSTILE_CREEPS,10); //
  var hostileConstroller = spawn.room.controller.pos.findClosestByRange(FIND_HOSTILE_CREEPS,12);
  if (hostileSpawn||hostileConstroller) {
    var value = spawn.room.controller.activateSafeMode();
    console.log('WARNING - ENEMY IN BASE - safemode activated: '+value);
    Game.notify('WARNING - ENEMY IN BASE - safemode activated: '+value);
  }


     }

};
module.exports = mainSpawn;
