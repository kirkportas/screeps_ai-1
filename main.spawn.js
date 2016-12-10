var tasks = require('tasks');
var roomCreepcalc = require('room.creepcalc');

StructureSpawn.prototype.createCreepAdvanced = function(spawn,type,body,memory2={}) {
  memory1 = {role: type, homeRoom: spawn.room.name, spawnerAction:'RENEW'}
  for (var attrname in memory2) { memory1[attrname] = memory2[attrname]; }
  var res = spawn.canCreateCreep(body);
  console.log(type);
  if (res == OK) {
    var name = spawn.createCreep(body, spawn.findNextName(type),memory1);
    console.log('Spawning new '+type+': '+ name+' in room '+spawn.room.name) ;
    return true;
  } else if (res==ERR_NOT_ENOUGH_ENERGY) {
    console.log('Need more energy at ',spawn.name)
  } else {
    console.log('error ',res,' at ',spawn.name)
  }
  return false;
}

StructureSpawn.prototype.createBody = function(arg) {
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

StructureSpawn.prototype.findNextName = function(type) {
    var finaleName
    for (var i=1;true;i++) {
        if(!Game.creeps[type+i]) {
            finaleName=type+i;
            break;
        }
    }
    return finaleName;
}
StructureSpawn.prototype.spawnExtracter = function() {
  var extractor = this.room.find(FIND_STRUCTURES,(structure)=>structure.structureType==STRUCTURE_EXTRACTOR)[0];
  if (extractor&&this.room.terminal) {
    var mineral = this.room.find(FIND_MINERALS)[0];
    var mineralsInTerm=this.room.terminal.store[mineral.mineralType];
      var extracters = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == this.room.name && creep.memory.role == 'extracter' && (creep.ticksToLive>100 || creep.spawning) &&creep.memory.extractor==extractor.id&&creep.memory.mineral==mineral.id);
      if (extracters<1&&(!mineralsInTerm||mineralsInTerm<25000)&&mineral.mineralAmount>5000) {
        this.createCreepAdvanced(this,'extracter',this.createBody({work:8,carry:4,move:4}),{extractor:extractor.id,mineral:mineral.id});
        return true;
      }

  }
  return false;
}

StructureSpawn.prototype.spawnRemoteHarvesters = function() {
  var energyAvav = this.room.energyCapacityAvailable;
  var scoutTo=this.room.memory.scout;
  for (var roomName in scoutTo) {
    if (this.room.memory.expand<scoutTo[roomName].dist) continue;
      //scout
      if (!scoutTo[roomName].timeSinceLastScout>1500 || scoutTo[roomName].timeSinceLastScout==-1) {
        if (!scoutTo[roomName].lastScoutSent || ((Game.times-scoutTo[roomName].lastScoutSent)>500)) {
          if (this.createCreepAdvanced(this,'scout',this.createBody({move:1}),{targetRoom:roomName})) {
            console.log('sending a scout to ',roomName);
            scoutTo[roomName].lastScoutSent=Game.time;
            return true;
          }
        }
      }

      if (!Memory.rooms[roomName]) continue;
      if (!Memory.rooms[roomName].scoutFromOther) continue;
      //if (Memory.rooms[roomName].scoutFromOther.closestRoom!=this.room.name) {console.log('not best room '+this.room.name+' to '+roomName);continue; }
      var scoutFrom=Memory.rooms[roomName].scoutFromOther;
      if (!scoutFrom||((Game.rooms[roomName]) && Game.rooms[roomName].find(FIND_MY_SPAWNS)[0])) continue; //Dont send to own room

      if (scoutFrom.danger==0&&Memory.rooms[roomName].scoutFromOther.closestRoom==this.room.name) {
      var sources = scoutFrom.from[this.room.name].sources;
        // CLAIMERS
        var reservation = scoutFrom.reservation;
        if (reservation<2000 && reservation>=0) {
          if (Object.keys(sources).length>=2) {  // do I WANT to claim this room?
            let claimers = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == this.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'claimer').length;
            let size= Math.min(3,Math.floor(energyAvav/650));
            let claimersNeeded= Math.max(1,Math.floor(2/size));
            if (claimers<claimersNeeded) {
              this.createCreepAdvanced(this,'claimer',this.createBody({move:size,claim:size}),{targetRoom:roomName});
              return true;
            }
          }
        }

        //builders
        /*
        var constructionSites = scoutFrom.myConstructionSites;
        var damagedBuildings = scoutFrom.myDamagedStructures;
        let remoteBuilders = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'remoteBuilder' ).length;
        let remoteNeeded= Math.min(1,Math.ceil((constructionSites+damagedBuildings)/25));
        var size = Math.min(8,Math.floor((spawn.room.energyCapacityAvailable)/200));
        if (remoteBuilders<remoteNeeded) {
          createCreepAdvanced(spawn,'remoteBuilder',createBody({move:size,carry:size,work:size}),{targetRoom:roomName});
          return true;
        }
        */

        // REMOTE HARVESTERS AND HAULERS
        for (var sourceId in sources) {
          if (!sources[sourceId].pathLen) continue;
          //console.log(scoutFrom.sources[sourceId].pos.x)
          //var sourceGlobal=scoutFrom.sources[sourceId];
          //let remoteBuilders = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'remoteBuilder' ).length;
          var pathLen=sources[sourceId].pathLen;
          let harvestersRemote = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == this.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'remoteHarvester' && creep.memory.pref == sourceId && (creep.ticksToLive>pathLen+10 || creep.spawning)).length;
          //let haulersRemote = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'remoteHauler' && creep.memory.pref == sources[sourceId].container.id && (creep.ticksToLive>pathLen+10 || creep.spawning)).length;

          var obtainable = 5;
          if (scoutFrom.reservation>1000) {obtainable=10}

          var optimalSize=Math.ceil((((obtainable*pathLen*2)+5)/50) * 1.4);
          var maxSize = Math.floor((this.room.energyCapacityAvailable/100)+100);
          var size=Math.min(optimalSize,maxSize,32);

          if (harvestersRemote<1) {
            this.createCreepAdvanced(this,'remoteHarvester',this.createBody({move:3,carry:2,work:6}),{targetRoom:roomName, pref: sourceId, prefPos:scoutFrom.sources[sourceId].pos, spawnerAction: "none"});
            return true;
          }
          if (sources[sourceId].container) {
            let haulersRemote = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == this.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'remoteHauler' && creep.memory.pref == sources[sourceId].container.id && (creep.ticksToLive>pathLen+10 || creep.spawning)).length;
            if (haulersRemote<1) {
              this.createCreepAdvanced(this,'remoteHauler',this.createBody({move:Math.ceil((size+1)/2),carry:size,work:1}),{targetRoom:roomName, pref: sources[sourceId].container.id, prefPos:sources[sourceId].container.pos, pathLen:pathLen,spawnerAction: "none"});
              return true;
            }
          }
      }
    }
    //ATTACK (defend)
    if (scoutFrom.danger==1&&Memory.rooms[roomName].scoutFromOther.closestRoom==this.room.name) {
      if (!scoutFrom.lastAttackerSent || ((Game.time-scoutFrom.lastAttackerSent)>1)) {
        var size = Math.min(15,Math.floor(((energyAvav-400/180))*0.80));
        console.log(size)
        if (this.createCreepAdvanced(this,'attacker',this.createBody({move:size+2,attack:size,rangedAttack:2}),{targetRoom:roomName,fleeAfter:true})) {
          console.log('sending a attacker to ',roomName);
          scoutFrom.lastAttackerSent=Game.time;
          return true;
        }
      }
    }
}
return false;
}

StructureSpawn.prototype.spawnHarvesters  = function() {
  var energyAvav = this.room.energyCapacityAvailable;
  var energyNow = this.room.energyAvailable;
  var sources = this.room.memory.allSources;
  for (var i=0;i<sources.length;i++) {
    var source=sources[i];
    var sourceObj = Game.getObjectById(source.id);

    var preferedSource = source.id;
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == this.room.name && creep.memory.role == 'harvester' && (creep.ticksToLive>100 || creep.spawning) &&creep.memory.pref == preferedSource);

    if (energyAvav>=750 && (harvesters.length>0 || energyNow>=750)) {
      if ((harvesters.length<1 &&  source.safe)) {
        if (this.canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE])== OK) {
          this.createCreepAdvanced(this,'harvester',[WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE],{pref:preferedSource})
        }
        return true;;
      }
    } else {
      //console.log('spawning simple')
      if (harvesters.length<Math.min(3,source.slots) && source.safe) {
        if (this.canCreateCreep([WORK,WORK,CARRY,MOVE])== OK) {
          this.createCreepAdvanced(this,'harvester',[WORK,WORK,CARRY,MOVE],{pref:preferedSource})
        }
        return true;
      }
    }

  }
  return false;
}

StructureSpawn.prototype.spawnUpgraders  = function(cur) {
  var energyAvav = this.room.energyCapacityAvailable;
  var centralContainer = tasks.getCentralStorage(this);
  var links = this.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_LINK }});
  var upgradersNeeded = 0;
  if (centralContainer) {
    if (centralContainer.store[RESOURCE_ENERGY]>centralContainer.storeCapacity*0.50) upgradersNeeded+=1;
    if (centralContainer.store[RESOURCE_ENERGY]>centralContainer.storeCapacity*0.75) upgradersNeeded+=1;
    if (centralContainer.store[RESOURCE_ENERGY]==centralContainer.storeCapacity) upgradersNeeded+=3;
    upgradersNeeded+=Math.max(0,Math.floor((centralContainer.store[RESOURCE_ENERGY]-this.room.memory.bufferenergy)/8000));
  }
  if (upgradersNeeded==0 && this.room.controller.ticksToDowngrade<2000) upgradersNeeded++;

  if (cur<upgradersNeeded) {
    if (links.length>2) {
      var moveModules = Math.min(4,Math.floor(energyAvav/500));
      this.createCreepAdvanced(this,'upgrader',this.createBody({move:moveModules, carry:moveModules,work:moveModules*4}),{spawnerAction: "none"});
    } else {
      if (this.room.storage && this.room.storage.pos.getRangeTo(this.room.controller)<6) {
        var modulesOfEach = Math.min(8,Math.floor(energyAvav/300)); //Spawn compact
        this.createCreepAdvanced(this,'upgrader',this.createBody({move:modulesOfEach,carry:modulesOfEach,work:modulesOfEach*2}));
      } else {
        var modulesOfEach = Math.min(12,Math.floor(energyAvav/200));
        this.createCreepAdvanced(this,'upgrader',this.createBody({move:modulesOfEach,carry:modulesOfEach,work:modulesOfEach}));
      }
    }
    return true;
  } else return false;


}
StructureSpawn.prototype.spawnBuilders  = function(cur) {
  var energyAvav = this.room.energyCapacityAvailable;
  var centralContainer = tasks.getCentralStorage(this);
  var energyNeeded = 0;
  var repairNeeded = 0;
  var constructionSites = this.room.find(FIND_CONSTRUCTION_SITES);
  constructionSites.forEach(site => energyNeeded+=(site.progressTotal-site.progress));
  var structures = this.room.find(FIND_STRUCTURES);
  var room2=this.room;
  _.forEach(structures, function(struc){
    if (struc.hitsMax!==undefined && struc.hits<struc.hitsMax*0.5 && struc.structureType!=STRUCTURE_WALL && struc.structureType!=STRUCTURE_RAMPART) {
      repairNeeded+= (struc.hitsMax*0.75-struc.hits)
    }
    if (struc.hitsMax!==undefined && struc.hits<room2.memory.wallHitsmin && (struc.structureType==STRUCTURE_WALL || struc.structureType==STRUCTURE_RAMPART)) {
      repairNeeded+= (room2.memory.wallHitsMax-struc.hits)
    }
  });

  var energyPerBuilder=6000*(Math.min(5,Math.floor(energyAvav/200))/5);
  var buildersNeeded = Math.min(3,Math.max(0,Math.ceil( (energyNeeded/energyPerBuilder) + (repairNeeded/(energyPerBuilder*20)) )));

  if (centralContainer) {
    if (centralContainer.store[RESOURCE_ENERGY]<this.room.memory.bufferenergy) buildersNeeded=Math.min(1,buildersNeeded);
  }

  if (cur<buildersNeeded) {
    var modulesOfEach = Math.min(5,Math.floor(energyAvav/200));
    this.createCreepAdvanced(this,'builder',this.createBody({carry:modulesOfEach,move:modulesOfEach, work:modulesOfEach}));
    return true;
  } else return false;

}

StructureSpawn.prototype.spawnArmy  = function() {
  var energyAvav = this.room.energyCapacityAvailable;
  if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '1').length<0) { // HEALERS
    if(this.createCreepAdvanced(this,'attacker',this.createBody({tough:8,move:8,heal:8}),{flag:'attack',manual:'1'})) return true;
  }
  if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '2').length<0) {
    if (this.createCreepAdvanced(this,'attacker',this.createBody({move:1}),{flag:'attack',manual:'2'})) return true;
  }
  if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '3').length<0) { //MELLEE
    if (this.createCreepAdvanced(this,'attacker',this.createBody({tough:0,move:16,attack:16}),{flag:'attack',manual:'3'})) return true;
  }

  if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '4').length<0 && spawn.room.name=='E65S62') {
    if (this.createCreepAdvanced(this,'remoteHauler',this.createBody({move:16,carry:32}),{manual:'4'})) return true;
  }

  if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '5').length<0 && spawn.room.name=='E68S62') {
    if (this.createCreepAdvanced(this,'claimer',this.createBody({move:1,claim:1}),{takeOver:true,targetRoom:'E67S65',manual:'5'})) return true;
  }
  if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '6').length<0&& spawn.room.name=='E68S62') {
    if (this.createCreepAdvanced(this,'remoteBuilder',this.createBody({move:8,carry:8,work:8}),{targetRoom:'E67S65',manual:'6'})) return true;
  }

  if (_.filter(Game.creeps, (creep)  => creep.memory.manual == '7').length<0) { // HEALERS
    if(this.createCreepAdvanced(this,'attacker',this.createBody({tough:8,move:8,heal:8}),{flag:'attacl2',manual:'7'})) return true;
  }
  return false;
}

StructureSpawn.prototype.spawnHaulers  = function(cur1,cur2) {
  var energyAvav = this.room.energyCapacityAvailable;
  var energyNow = this.room.energyAvailable;
  var links = this.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_LINK }});
  var containers = this.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }});
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
  if (links.length>=2 || this.room.memory.expand>0) {
    spawnHaulersNeeded=1;
  }

  if(cur1 < haulersNeeded) {
    var modulesOfEach = Math.min(8,Math.floor(energyAvav/100));
    this.createCreepAdvanced(this,'hauler',this.createBody({carry:modulesOfEach,move:Math.ceil(modulesOfEach/2)}));
    return true;
  } else if(cur2 < spawnHaulersNeeded) {
    var modulesOfEach = Math.min(4,Math.floor(energyNow/150));
    this.createCreepAdvanced(this,'spawnHauler',this.createBody({move:modulesOfEach, carry:modulesOfEach*2}));
    return true;
  } else return false;


}
StructureSpawn.prototype.spawnDefenders  = function(cur) {
  var energyAvav = this.room.energyCapacityAvailable;
  var defendersNeeded = 0;
  var suicideDefenders=false;
  var invaders=0;
  var hostiles = this.room.find(FIND_HOSTILE_CREEPS);
  var hostilesBodyparts=0;
  _.forEach(hostiles, function(creep){
    hostilesBodyparts+=creep.body.length
    if (creep.owner.username=='Invader') invaders++;
  })
  if (invaders==hostiles.length) { //Blir kun angrepet av NPC
    suicideDefenders=true;
  }

  if(cur < defendersNeeded) {
      var modulesOfEach = Math.max(2,Math.min(16,Math.floor(energyNow/400)));
      this.createCreepAdvanced(this,'defender',this.createBody({move:modulesOfEach,rangedAttack:modulesOfEach},{suicideAfter:suicideDefenders}));
      return true;
    } else return false;


}

StructureSpawn.prototype.work  = function(spawn) {



  var renewAndKill = function(spawn) {
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
  var containers = spawn.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }});
  //console.log(energyNow,'-',energyAvav);


  for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
          delete Memory.creeps[name];
      }
  }

  if (renewAndKill(spawn)) {
  } else if (this.spawnHarvesters()) {
  } else if (this.spawnExtracter()) {
  } else if (containers.length>=1) {
    if (this.spawnHaulers(count.haulers,count.spawnHaulers)) {
    } else if (this.spawnDefenders(count.defenders)) {
    } else if(this.spawnBuilders(count.builders)) {
      } else if(this.spawnUpgraders(count.upgraders)) {
      } else if (expand>0 && this.spawnArmy(spawn)) {
      } else if (expand>0 && this.spawnRemoteHarvesters()) {
      }

    }
  }
}
