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
    global.createBody = function(move,work,carry,attack,rangedAttack,heal,claim,tough) {
      var modules=[];
      for (var m=0;m<move;m++) {modules.push(MOVE);}
      for (var m=0;m<work;m++) {modules.push(WORK);}
      for (var m=0;m<carry;m++) {modules.push(CARRY);}
      for (var m=0;m<carry;m++) {modules.push(ATTACK);}
      for (var m=0;m<carry;m++) {modules.push(RANGED_ATTACK);}
      for (var m=0;m<carry;m++) {modules.push(HEAL);}
      for (var m=0;m<carry;m++) {modules.push(CLAIM);}
      for (var m=0;m<carry;m++) {modules.push(TOUGH);}
      return modules;


    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.ticksToLive>50).length;
    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler' && creep.ticksToLive>50).length;
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader'&& creep.ticksToLive>50).length;
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder'&& creep.ticksToLive>50).length;
    var scoutsN = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout'&& creep.memory.targetRoom == 'E65S61' && creep.ticksToLive>50).length;
    var scoutsS = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout'&& creep.memory.targetRoom == 'E65S63' && creep.ticksToLive>50).length;
    var warriors = _.filter(Game.creeps, (creep) => creep.memory.role == 'warrior').length;

    var containers = spawn.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }});
    var links = spawn.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_LINK }});
    //var centralContainer=spawn.pos.findInRange(FIND_STRUCTURES,5, {  filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) }})[0];
    var centralContainer = tasks.getCentralStorage(spawn);
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
    var energyInContainers=0;
    _.forEach(containers, function(struc){
      energyInContainers+=struc.store[RESOURCE_ENERGY];
    });
    var haulersNeeded=2;
    if (energyInContainers>3000) haulersNeeded++;

    var energyPerBuilder=6000;
    var buildersNeeded = Math.min(1,Math.max(0,Math.ceil( (energyNeeded/energyPerBuilder) + (repairNeeded/(energyPerBuilder*20)) )));
    console.log(constructionSites.length,' sites need energy: ', energyNeeded,' by builders: ',buildersNeeded,'. Damage to repair: ',repairNeeded);


    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    //cleanup dedicated miners && watch
    var sources = spawn.room.memory.allSources;
    for (var i=0;i<sources.length;i++) {
      var source=sources[i];
      var sourceObj = Game.getObjectById(source.id);
      if (sourceObj.ticksToRegeneration==1) {
        //Game.notify('sourceRegen;'+sourceObj.ticksToRegeneration+';'+sourceObj.energy,60);
      }
      //console.log(sourceObj.ticksToRegeneration,'ticks. Left: ',sourceObj.energy);
      for (var ii=0;ii<source.miners.length;ii++) {
        if (Game.getObjectById(source.miners[ii]) == null) {
        source.miners.splice(ii, 1);
      }
    }
      //spawns harvesters per source
      var energyAvav = spawn.room.energyCapacityAvailable;
      //console.log(energyAvav);
      if (energyAvav>=750) {
        //console.log(Game.getObjectById(source.miners[0]).ticksToLive);
        if ((source.miners.length<1 || (source.miners.length==1 && Game.getObjectById(source.miners[0]).ticksToLive<100) && source.safe)) {
          if (spawn.canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE] == OK)) {
            var preferedSource = source.id;
            var name = spawn.createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], findNextName('harvester'), {role: 'harvester', pref:preferedSource});
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

  if (containers.length>=1) {
    if(haulers < haulersNeeded) {
        var energyAvav = spawn.room.energyCapacityAvailable;
        var modulesOfEach = Math.min(8,Math.floor(energyAvav/100));
        var modules=[];
        for (var m=0;m<modulesOfEach;m++) {modules.push(CARRY);}
        for (var m=0;m<Math.ceil(modulesOfEach/2);m++) {modules.push(MOVE);}
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
    } else if(upgraders < 1 || ((centralContainer.store[RESOURCE_ENERGY]>centralContainer.storeCapacity*0.75 || centralContainer.store[RESOURCE_ENERGY]>20000) && upgraders<3)) {
      var energyAvav = spawn.room.energyCapacityAvailable;
      var modules=[];
      if (links.length>=2) {
        energyAvav-=200;
        modules=createBody(2,Math.min(8,Math.floor(energyAvav/100)),2,0,0,0,0,0);
        //for (var m=0;m<Math.min(8,Math.floor(energyAvav/100));m++) {modules.push(WORK);}
        //for (var m=0;m<2;m++) {modules.push(CARRY);}
        //for (var m=0;m<2;m++) {modules.push(MOVE);}
      } else {
        var modulesOfEach = Math.min(6,Math.floor(energyAvav/200));
         modules=createBody(modulesOfEach,modulesOfEach,modulesOfEach,0,0,0,0,0)
        //for (var m=0;m<modulesOfEach;m++) {modules.push(WORK);}
        //for (var m=0;m<modulesOfEach;m++) {modules.push(CARRY);}
        //for (var m=0;m<modulesOfEach;m++) {modules.push(MOVE);}
      }
      var newName = spawn.createCreep(modules, findNextName('upgrader'), {role: 'upgrader'});
      console.log('Spawning new upgrader: ' + newName);
    } else if(scoutsN < 0) {
      var newName = spawn.createCreep([MOVE,CARRY,WORK], findNextName('scout'), {role: 'scout', delivered: 0, startRoom: spawn.room.name,targetRoom:'E65S61'});
      console.log('Spawning new scout: ' + newName);
    } else if(scoutsS < 0) {
      var newName = spawn.createCreep([MOVE,MOVE,MOVE,CARRY,CARRY,WORK], findNextName('scout'), {role: 'scout', delivered: 0, startRoom: spawn.room.name,targetRoom:'E65S63', pref:'57ef9eb986f108ae6e60fccf'});
      console.log('Spawning new scout: ' + newName);
    } else if(warriors < 0) {
      var newName = spawn.createCreep([MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK], findNextName('warrior'), {role: 'warrior'});
      console.log('Spawning new warrior: ' + newName);
    }
  }

  var creep = spawn.pos.findInRange(FIND_CREEPS,1);
  if (creep.length && creep[0].memory.role=='builder' && buildersNeeded==0) {
    spawn.recycleCreep(creep[0]);
  } else if (creep.length && creep[0].ticksToLive<500) {
    spawn.renewCreep(creep[0]);
  }
  var hostileSpawn = spawn.pos.findInRange(FIND_HOSTILE_CREEPS,10); //
  var hostileConstroller = spawn.room.controller.pos.findInRange(FIND_HOSTILE_CREEPS,12);
  if (hostileSpawn.length||hostileConstroller.length) {
    var value = spawn.room.controller.activateSafeMode();
    console.log('WARNING - ENEMY IN BASE - safemode activated: '+value);
    Game.notify('WARNING - ENEMY IN BASE - safemode activated: '+value);
  }


     }

};
module.exports = mainSpawn;
