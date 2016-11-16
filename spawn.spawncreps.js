var spawnSpawncreeps = {

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
      if (spawn.canCreateCreep(body) == OK) {
        var name = spawn.createCreep(body, findNextName(type),memory1);
        console.log('Spawning new '+type+': '+ name+' in room '+spawn.room.name) ;
        return true;
      } //console.log('waiting to spawn, ',type,'error: ',spawn.canCreateCreep(body))
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
            let harvestersRemote = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'remoteHarvester' && creep.memory.pref == sourceId).length;
            var size = Math.floor((spawn.room.energyCapacityAvailable*0.75)/200);
            var carrycap= (size*50)
            var pathLen=sources[sourceId].pathLen;
            var obtainable = 5;
            if (sources[sourceId].reservation>1000) {obtainable=10}
            var sourcePerTick=(carrycap/((pathLen*2)+25+2)*0.9); //Empirisk verdi for å justere feil
            var needed=Math.round(obtainable/sourcePerTick);
            if (sourceId=='57ef9ea486f108ae6e60fa55') needed=2;
            //console.log('data: '+spawn.room+' '+roomName+' '+sourceId+' '+' '+harvestersRemote+' '+needed);
            if (harvestersRemote<needed) {
              createCreepAdvanced(spawn,'remoteHarvester',createBody({move:size,carry:size,work:size}),{targetRoom:roomName, pref: sourceId});
              return true;
            }
        }
      }
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
        //console.log(spawn.room.name,'  ',roomName,'  ',remoteBuilders,'  ',remoteNeeded)
        if (remoteBuilders<remoteNeeded) {
          createCreepAdvanced(spawn,'remoteBuilder',createBody({move:4,carry:2,work:2}),{targetRoom:roomName});
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
        if (Object.keys(scout[roomName].sources).length>=1) {  // do I WANT to claim this room?
          let claimers = _.filter(Game.creeps, (creep) => creep.memory.homeRoom == spawn.room.name && creep.memory.targetRoom == roomName && creep.memory.role == 'claimer').length;
          let claimersNeeded= 2;
          if (claimers<claimersNeeded) {
            createCreepAdvanced(spawn,'claimer',createBody({move:1,claim:1}),{targetRoom:roomName});
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
  
  run: function(spawn) {

  },

};
module.exports = spawnSpawncreeps;
