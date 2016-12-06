var tasks = require('tasks');
var roomCreepcalc = require('room.creepcalc');
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
    global.createBody = function(arg) {
      var modules=[];
      for (var m=0;m<arg.tough;m++) {modules.push(TOUGH);}
      for (var m=0;m<arg.work;m++) {modules.push(WORK);}
      for (var m=0;m<arg.carry;m++) {modules.push(CARRY);}
      for (var m=0;m<arg.move-1;m++) {modules.push(MOVE);}
      for (var m=0;m<arg.attack;m++) {modules.push(ATTACK);}
      for (var m=0;m<arg.rangedAttack;m++) {modules.push(RANGED_ATTACK);}
      for (var m=0;m<arg.heal;m++) {modules.push(HEAL);}
      for (var m=0;m<arg.claim;m++) {modules.push(CLAIM);}

      if (arg.move>0) {modules.push(MOVE);}
      return modules;
    }
    global.createCreepAdvanced = function(spawn,type,body,memory2={}) {
      memory1 = {role: type, homeRoom: spawn.room.name, spawnerAction:'RENEW'}
      for (var attrname in memory2) { memory1[attrname] = memory2[attrname]; }
      var res = spawn.canCreateCreep(body);
      console.log(type);
      if (res == OK) {
        var name = spawn.createCreep(body, findNextName(type),memory1);
        console.log('Spawning new '+type+': '+ name+' in room '+spawn.room.name) ;
        return true;
      } else if (res==ERR_NOT_ENOUGH_ENERGY) {
        console.log('Need more energy at ',spawn.name)
      } else {
        console.log('error ',res,' at ',spawn.name)
      }
      return false;
    }
    global.spawnExtracter = function(spawn) {
      //cleanup dedicated miners && watch
      var extractor = spawn.room.find(FIND_STRUCTURES,(structure)=>structure.structureType==STRUCTURE_EXTRACTOR)[0];
      if (extractor&&spawn.room.terminal) {
        var mineral = spawn.room.find(FIND_MINERALS)[0];
        var mineralsInTerm=spawn.room.terminal.store[mineral.mineralType];
          var extracters = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.role == 'extracter' && (creep.ticksToLive>100 || creep.spawning) &&creep.memory.extractor==extractor.id&&creep.memory.mineral==mineral.id);
          if (extracters<1&&(!mineralsInTerm||mineralsInTerm<25000)&&mineral.mineralAmount>5000) {
            createCreepAdvanced(spawn,'extracter',createBody({work:8,carry:4,move:4}),{extractor:extractor.id,mineral:mineral.id});
            return true;
          }

      }

      return false;
    }
    global.spawnHarvesters = function(spawn) {
      //cleanup dedicated miners && watch
      var sources = spawn.room.memory.allSources;
      for (var i=0;i<sources.length;i++) {
        var source=sources[i];
        var sourceObj = Game.getObjectById(source.id);

        var preferedSource = source.id;
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.role == 'harvester' && (creep.ticksToLive>100 || creep.spawning) &&creep.memory.pref == preferedSource);

        if (energyAvav>=750 && (harvesters.length>0 || energyNow>=750)) {
          if ((harvesters.length<1 &&  source.safe)) {
            if (spawn.canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE])== OK) {
              createCreepAdvanced(spawn,'harvester',[WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE],{pref:preferedSource})
            }
            return true;;
          }
        } else {
          //console.log('spawning simple')
          if (harvesters.length<Math.min(3,source.slots) && source.safe) {
            if (spawn.canCreateCreep([WORK,WORK,CARRY,MOVE])== OK) {
              createCreepAdvanced(spawn,'harvester',[WORK,WORK,CARRY,MOVE],{pref:preferedSource})
            }
            return true;
          }
        }

      }
      return false;
    }

    global.spawnRemoteHarvesters = function(spawn) {
      var scoutTo=spawn.room.memory.scout;
      for (var roomName in scoutTo) {
        if (scoutTo[roomName].danger==0) {
          var scoutFrom=Memory.rooms[roomName].scoutFrom[spawn.room.name];
          if (!scoutFrom||(Game.rooms[roomName]) && Game.rooms[roomName].find(FIND_MY_SPAWNS)[0]) continue; //Dont send to own room
          console.log('test')
          var sources = scoutFrom.sources;
          for (var sourceId in sources) {
            if (!sources[sourceId].pathLen) continue;
            //let remoteBuilders = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'remoteBuilder' ).length;
            let harvestersRemote = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'remoteHarvester' && creep.memory.pref == sourceId && (creep.ticksToLive>100 || creep.spawning)).length;
            let haulersRemote = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'remoteHauler' && creep.memory.pref == sources[sourceId].container.id && (creep.ticksToLive>100 || creep.spawning)).length;
            var pathLen=sources[sourceId].pathLen;
            var obtainable = 5;
            if (sources[sourceId].reservation>1000) {obtainable=10}

            var optimalSize=Math.ceil((((obtainable*pathLen*2)+5)/50) * 1.4);
            var maxSize = Math.floor(spawn.room.energyCapacityAvailable/100);
            var size=Math.min(optimalSize,maxSize,25);

            if (harvestersRemote<1) {
              createCreepAdvanced(spawn,'remoteHarvester',createBody({move:3,carry:2,work:6}),{targetRoom:roomName, pref: sourceId, prefPos:sources[sourceId].pos, spawnerAction: "none"});
              return true;
            }
            if (haulersRemote<1) {
              createCreepAdvanced(spawn,'remoteHauler',createBody({move:Math.ceil(size/2),carry:size}),{targetRoom:roomName, pref: sources[sourceId].container.id, prefPos:sources[sourceId].container.pos, spawnerAction: "none"});
              return true;
            }
        }
      }
    }
    return false;
  }
  global.spawnRemoteHarvesters2 = function(spawn) {
    var scout=spawn.room.memory.scout;
    for (var roomName in scout) {
      if (scout[roomName].danger==0) {
        var sources = scout[roomName].sources;
        if ((Game.rooms[roomName]) && Game.rooms[roomName].find(FIND_MY_SPAWNS)[0]) continue; //Dont send to own room
        for (var sourceId in sources) {
          if (!sources[sourceId].pathLen) continue;
          //let remoteBuilders = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'remoteBuilder' ).length;
          let harvestersRemote = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'remoteHarvester' && creep.memory.pref == sourceId).length;
          var size = Math.min(8,Math.floor((spawn.room.energyCapacityAvailable)/200));
          var carrycap= (size*50)
          var pathLen=sources[sourceId].pathLen;
          var obtainable = 5;
          if (sources[sourceId].reservation>1000) {obtainable=10}
          var sourcePerTick=(carrycap/((pathLen*2)+25+2))*0.90; //Empirisk verdi for å justere feil
          var needed=Math.round(obtainable/sourcePerTick);
          //if (sourceId=='57ef9ea486f108ae6e60fa55') needed=1;
          //console.log('data: '+spawn.room+' '+roomName+' '+sourceId+' '+' '+harvestersRemote+' '+needed);
          if (harvestersRemote<needed) {
            createCreepAdvanced(spawn,'remoteHarvester',createBody({move:size,carry:size,work:size}),{targetRoom:roomName, pref: sourceId, prefPos:sources[sourceId].pos, spawnerAction: "none"});
            return true;
          }
      }
    }
  }
  return false;
}
  global.spawnArmy = function(spawn) {
    if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '1').length<0) { // HEALERS
      if(createCreepAdvanced(spawn,'attacker',createBody({tough:8,move:8,heal:8}),{flag:'attack',manual:'1'})) return true;
    }
    if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '2').length<0) {
      if (createCreepAdvanced(spawn,'attacker',createBody({move:1}),{flag:'attack',manual:'2'})) return true;
    }
    if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '3').length<0) { //MELLEE
      if (createCreepAdvanced(spawn,'attacker',createBody({tough:0,move:16,attack:16}),{flag:'attack',manual:'3'})) return true;
    }

    if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '4').length<0 && spawn.room.name=='E65S62') {
      if (createCreepAdvanced(spawn,'remoteHauler',createBody({move:16,carry:32}),{manual:'4'})) return true;
    }

    if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '5').length<0 && spawn.room.name=='E68S62') {
      if (createCreepAdvanced(spawn,'claimer',createBody({move:1,claim:1}),{takeOver:true,targetRoom:'E67S65',manual:'5'})) return true;
    }
    if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '6').length<0&& spawn.room.name=='E68S62') {
      if (createCreepAdvanced(spawn,'remoteBuilder',createBody({move:8,carry:8,work:8}),{targetRoom:'E67S65',manual:'6'})) return true;
    }

    if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '7').length<0) { // HEALERS
      if(createCreepAdvanced(spawn,'attacker',createBody({tough:8,move:8,heal:8}),{flag:'attacl2',manual:'7'})) return true;
    }



    return false;
  }


  global.spawnRemoteBuilders = function(spawn) {
    var scout=spawn.room.memory.scout;
    for (var roomName in scout) {
      if (scout[roomName].danger==0) {
        var constructionSites = scout[roomName].myConstructionSites;
        var damagedBuildings = scout[roomName].myDamagedStructures;
        if ((Game.rooms[roomName]) && Game.rooms[roomName].find(FIND_MY_SPAWNS)[0]) continue; //Dont send to own room
        let remoteBuilders = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'remoteBuilder' ).length;
        let remoteNeeded= Math.min(2,Math.ceil((constructionSites+damagedBuildings)/25));
        var size = Math.min(8,Math.floor((spawn.room.energyCapacityAvailable)/200));
        if (remoteBuilders<remoteNeeded) {
          createCreepAdvanced(spawn,'remoteBuilder',createBody({move:size,carry:size,work:size}),{targetRoom:roomName});
          return true;
        }
    }
  }
  return false;
}
  global.spawnClaimers = function(spawn) {
    var scout=spawn.room.memory.scout;
    for (var roomName in scout) {
      if (scout[roomName].danger==0) {
        var reservation = scout[roomName].reservation;
        if ((Game.rooms[roomName]) && Game.rooms[roomName].find(FIND_MY_SPAWNS)[0]) continue; //Dont send to own room
        if (reservation<3000 && reservation>=0) {
          if (Object.keys(scout[roomName].sources).length>=2) {  // do I WANT to claim this room?
            let claimers = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'claimer').length;
            let size= Math.min(2,Math.floor(energyAvav/650));
            let claimersNeeded= Math.floor(2/size);
            if (claimers<claimersNeeded) {
              createCreepAdvanced(spawn,'claimer',createBody({move:size,claim:size}),{targetRoom:roomName});
              return true;
            }
          }
        }
    }
  }
  return false;
  }

  global.sendScouts = function(spawn) {
    var scout=spawn.room.memory.scout;
    for (var roomName in scout) {
      if ((Game.rooms[roomName]) && Game.rooms[roomName].find(FIND_MY_SPAWNS)[0]) continue; //Dont send to own room
      if (scout[roomName].danger==1) {
        if (!scout[roomName].lastAttackerSent || ((Game.time-scout[roomName].lastAttackerSent)>500)) {
          var size = Math.floor((energyAvav/180)*0.80)
          if (createCreepAdvanced(spawn,'attacker',createBody({move:size,attack:size}),{targetRoom:roomName,fleeAfter:true})) {
            console.log('sending a attacker to ',roomName);
            scout[roomName].lastAttackerSent=Game.time;
            return true;
          }
        }
      } else {
        if (scout[roomName].timeSinceLastScout>1500 || scout[roomName].timeSinceLastScout==-1) {
          if (!scout[roomName].lastScoutSent || ((Game.times-scout[roomName].lastScoutSent)>500)) {
            if (createCreepAdvanced(spawn,'scout',createBody({move:1}),{targetRoom:roomName})) {
              console.log('sending a scout to ',roomName);
              scout[roomName].lastScoutSent=Game.time;
              return true;
            }
          }
        }
      }

    }
    return false;
  }
  global.renewAndKill = function(spawn) {
    var creeps = spawn.pos.findInRange(FIND_MY_CREEPS,1);
    _.forEach(creeps, function(creep){
      if (creep.memory.spawnerAction=='KILL') {
        spawn.recycleCreep(creep);
        return true;
      } else if (creep && creep.ticksToLive<500 && creep.memory.spawnerAction=='RENEW' && creep.memory.role!='remoteHarvester') {
        spawn.renewCreep(creep);
        return true;
      }
    });
    return false;
  }

if (!spawn.spawning) {

  var count = roomCreepcalc.creepCount(spawn.room);
  var expand=spawn.room.memory.expand;
  var energyNow = spawn.room.energyAvailable;
  var energyAvav = spawn.room.energyCapacityAvailable;
  //console.log(energyNow,'-',energyAvav);
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
  if (energyAvav<450) {
    haulersNeeded=2;
  } else if (energyAvav<600) {
    haulersNeeded=2;
  } else {
    haulersNeeded=2;
  }
  if (energyInContainers>3000) haulersNeeded++;
  if (links.length>2) haulersNeeded--;
  if (links.length>3) haulersNeeded--;


  var spawnHaulersNeeded=0;
  if (links.length>=2 || expand) {
    spawnHaulersNeeded=1;
  }

  var energyPerBuilder=6000*(Math.min(5,Math.floor(energyAvav/200))/5);
  var buildersNeeded = Math.min(3,Math.max(0,Math.ceil( (energyNeeded/energyPerBuilder) + (repairNeeded/(energyPerBuilder*20)) )));
  //console.log(constructionSites.length,' sites need energy: ', energyNeeded,' by builders: ',buildersNeeded,'. Damage to repair: ',repairNeeded);
  if (centralContainer) {
    if (centralContainer.store[RESOURCE_ENERGY]<1000) buildersNeeded=0;
  }


  var upgradersNeeded = 0;
  if (centralContainer) {
    if (centralContainer.store[RESOURCE_ENERGY]>centralContainer.storeCapacity*0.50) upgradersNeeded+=1;
    if (centralContainer.store[RESOURCE_ENERGY]>centralContainer.storeCapacity*0.75) upgradersNeeded+=1;
    if (centralContainer.store[RESOURCE_ENERGY]==centralContainer.storeCapacity) upgradersNeeded+=3;
    upgradersNeeded+=Math.max(0,Math.floor((centralContainer.store[RESOURCE_ENERGY]-spawn.room.memory.bufferenergy)/8000));
  }
  if (upgradersNeeded==0 && spawn.room.controller.ticksToDowngrade<2000) upgradersNeeded++;
  //console.log('builders needed',buildersNeeded)
  //  || ((centralContainer.store[RESOURCE_ENERGY]>centralContainer.storeCapacity*0.75 || centralContainer.store[RESOURCE_ENERGY]>20000) && upgraders<4

  var defendersNeeded = 0;
  var suicideDefenders=false;
  var invaders=0;
  var hostiles = spawn.room.find(FIND_HOSTILE_CREEPS);
  var hostilesBodyparts=0;
  _.forEach(hostiles, function(creep){
    hostilesBodyparts+=creep.body.length
    if (creep.owner.username=='Invader') invaders++;
  })
  if (invaders==hostiles.length) { //Blir kun angrepet av NPC
    suicideDefenders=true;
  }

  for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
          delete Memory.creeps[name];
      }
  }

  if (renewAndKill(spawn)) {
  } else if (spawnHarvesters(spawn)) {
  } else if (spawnExtracter(spawn)) {
  } else if (containers.length>=1) {
      if(count.haulers < haulersNeeded) {
        var modulesOfEach = Math.min(8,Math.floor(energyAvav/100));
        createCreepAdvanced(spawn,'hauler',createBody({carry:modulesOfEach,move:Math.ceil(modulesOfEach/2)}));
      } else if(count.spawnHaulers < spawnHaulersNeeded) {
        var modulesOfEach = Math.min(4,Math.floor(energyAvav/150));
        createCreepAdvanced(spawn,'spawnHauler',createBody({move:modulesOfEach, carry:modulesOfEach*2}));
      } else if(count.defenders < defendersNeeded) {
        var modulesOfEach = Math.max(2,Math.min(16,Math.floor(energyNow/400)));
        createCreepAdvanced(spawn,'defender',createBody({move:modulesOfEach,rangedAttack:modulesOfEach},{suicideAfter:suicideDefenders}));
      } else if(count.builders < buildersNeeded) {
        var modulesOfEach = Math.min(5,Math.floor(energyAvav/200));
        createCreepAdvanced(spawn,'builder',createBody({carry:modulesOfEach,move:modulesOfEach, work:modulesOfEach}));
      } else if(count.upgraders < upgradersNeeded) {
        if (links.length>2) {
          var moveModules = Math.min(4,Math.floor(energyAvav/500));
          createCreepAdvanced(spawn,'upgrader',createBody({move:moveModules, carry:moveModules,work:moveModules*4}),{spawnerAction: "none"});
        } else {
          var modulesOfEach = Math.min(6,Math.floor(energyAvav/200));
          createCreepAdvanced(spawn,'upgrader',createBody({move:modulesOfEach,carry:modulesOfEach,work:modulesOfEach}));
        }
      } else if (expand && spawnArmy(spawn)) {
      } else if (expand && spawnRemoteBuilders(spawn)) {
      } else if (expand && spawnClaimers(spawn)) {
      } else if (expand && spawnRemoteHarvesters(spawn)) {
      } else if (expand && sendScouts(spawn)) {
      }

    }
  }



     }

};
module.exports = mainSpawn;
