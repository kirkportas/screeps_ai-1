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
    global.spawnHarvesters = function(spawn) {
      //cleanup dedicated miners && watch
      var sources = spawn.room.memory.allSources;
      for (var i=0;i<sources.length;i++) {
        var source=sources[i];
        var sourceObj = Game.getObjectById(source.id);

        //spawns harvesters per source
        var preferedSource = source.id;
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.role == 'harvester' && creep.ticksToLive>50 &&creep.memory.pref == preferedSource);

        if (energyAvav>=750 && (harvesters>0 || energyNow>=750)) {
          //console.log(Game.getObjectById(source.miners[0]).ticksToLive);
          if ((harvesters.length<1 || (harvesters.length==1 && harvesters[0].ticksToLive<100) && source.safe)) {
            if (spawn.canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE])== OK) {
              createCreepAdvanced(spawn,'harvester',[WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE],{pref:preferedSource})
            }
            return true;;
          }
        } else {
          console.log('spawning simple')
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
    if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '1').length<0) {
      if(createCreepAdvanced(spawn,'attacker',createBody({tough:7,move:7,heal:7}),{flag:'attack',manual:'1'})) return true;
    }
    if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '2').length<0) {
      if (createCreepAdvanced(spawn,'attacker',createBody({move:1}),{flag:'attack',manual:'2'})) return true;
    }
    if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '3').length<0) {
      if (createCreepAdvanced(spawn,'attacker',createBody({tough:8,move:8,attack:8}),{flag:'attack2',manual:'3'})) return true;
    }

    if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '5').length<1 && spawn.room.name=='E65S62') {
      //if (createCreepAdvanced(spawn,'claimer',createBody({move:1,claim:1}),{takeOver:true,targetRoom:'E66S62',manual:'5'})) return true;
    }
    if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '6').length<0 && spawn.room.name=='E65S62') {
      if (createCreepAdvanced(spawn,'remoteBuilder',createBody({move:16,carry:16,work:16}),{targetRoom:'E66S62',manual:'6'})) return true;
    }

    if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '4').length<0 && spawn.room.name=='E65S62') {
      if (createCreepAdvanced(spawn,'remoteHauler',createBody({move:16,carry:32}),{manual:'4'})) return true;
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
    var hostiles = spawn.room.find(FIND_HOSTILE_CREEPS);
    var hostilesBodyparts=0;
    _.forEach(hostiles, function(creep){
      hostilesBodyparts+=creep.body.length
    })
    defendersNeeded=Math.floor(hostilesBodyparts/25);
    if (spawn.room.name=='E65S62') {
      //defendersNeeded=Math.max(4,defendersNeeded);
    }


    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

if (!spawn.spawning) {
  if (renewAndKill(spawn)) {
  } else if (spawnHarvesters(spawn)) {
  } else if (containers.length>=1) {
      if(count.haulers < haulersNeeded) {
        var modulesOfEach = Math.min(8,Math.floor(energyAvav/100));
        createCreepAdvanced(spawn,'hauler',createBody({carry:modulesOfEach,move:Math.ceil(modulesOfEach/2)}));
      } else if(count.spawnHaulers < spawnHaulersNeeded) {
        createCreepAdvanced(spawn,'spawnHauler',createBody({move:2, carry:4}));
      } else if(count.defenders < defendersNeeded) {
        var modulesOfEach = Math.max(2,Math.min(4,Math.floor(energyNow/200)));
        createCreepAdvanced(spawn,'defender',createBody({move:modulesOfEach,rangedAttack:modulesOfEach}));
      } else if(count.builders < buildersNeeded) {
        var modulesOfEach = Math.min(5,Math.floor(energyAvav/200));
        createCreepAdvanced(spawn,'builder',createBody({carry:modulesOfEach,move:modulesOfEach, work:modulesOfEach}));
      } else if(count.upgraders < upgradersNeeded) {
        if (links.length>=2) {
          createCreepAdvanced(spawn,'upgrader',createBody({move:2, carry:2,work:Math.min(10,Math.floor((energyAvav-200)/100))}));
        } else {
          var modulesOfEach = Math.min(6,Math.floor(energyAvav/200));
            createCreepAdvanced(spawn,'upgrader',createBody({move:modulesOfEach,carry:modulesOfEach,work:modulesOfEach}));
        }
      } else if (expand && spawnArmy(spawn)) {
      } else if (expand && spawnRemoteBuilders(spawn)) {
      } else if (expand && spawnClaimers(spawn)) {
      } else if (expand && spawnRemoteHarvesters(spawn)) {
      } else if (expand && sendScouts(spawn)) {


      } else if(spawn.room.name=='E65S61' && count.scouts < 0) {
        createCreepAdvanced(spawn,'scout',createBody({move:1}),{targetRoom:'E64S61'});
      } /*else if(spawn.room.name=='E65S62' && claimers < 1) {
        createCreepAdvanced(spawn,'claimer',createBody({move:2,claim:2}),{targetRoom:'E64S61'});
      } */ else if(count.attacker < 0) {
        createCreepAdvanced(spawn,'attacker',createBody({move:4,attack:2}),{targetRoom:'E62S61'});
      } else if(spawn.room.name=='E65S62' && count.remoteBuilders < 0) {
        createCreepAdvanced(spawn,'remoteBuilder',createBody({move:4,carry:4,work:4}),{targetRoom:'E64S62'});
      } else if(spawn.room.name=='E65S61' && count.remoteBuilders < 0) {
        createCreepAdvanced(spawn,'remoteBuilder',createBody({move:2,carry:2,work:2}),{targetRoom:'E64S61'});
      }
    }
  }


  var hostileSpawn = spawn.pos.findInRange(FIND_HOSTILE_CREEPS,10); //
  var hostileConstroller = spawn.room.controller.pos.findInRange(FIND_HOSTILE_CREEPS,4);
  if (/*spawn.room.name=='E65S62' && */ (hostileSpawn.length||hostileConstroller.length)) {
    var value = spawn.room.controller.activateSafeMode();
    console.log('WARNING - ENEMY IN BASE - safemode activated: '+value);
    Game.notify('WARNING - ENEMY IN BASE - safemode activated: '+value);
  }


     }

};
module.exports = mainSpawn;
