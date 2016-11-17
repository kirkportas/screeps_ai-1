var mainSpawn = require('main.spawn');
var mainRoom = require('main.room');
var mainTower = require('main.tower');
var mainScout = require('main.scout');

var tasks = require('tasks');

var roleHarvester = require('role.harvester');
var roleHauler = require('role.hauler');
var roleSpawnhauler = require('role.spawnhauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleScout = require('role.scout');
var roleDefender = require('role.defender');
var roleAttacker= require('role.attacker');
var roleClaimer = require('role.claimer');
var roleRemotebuilder = require('role.remoteBuilder');
var roleRemoteHarvester = require('role.remoteHarvester');
var roleSuicide = require('role.suicide');

module.exports.loop = function () {

  var cpu = Game.cpu;
  var timeLast=cpu.getUsed();

  var timeSpawn=0;
  var timeRoom=0;
  var timeTower=0;
  var timeScout=0;

  var cpuLog=false



  for(var iRoom in Game.rooms) {
    var room = Game.rooms[iRoom]
    var spawn = room.find(FIND_MY_SPAWNS)[0];
    if (spawn!=undefined) {
      timeLast=cpu.getUsed(); mainRoom.run(room); timeRoom += cpu.getUsed()-timeLast;
      timeLast=cpu.getUsed(); mainTower.run(room); timeTower += cpu.getUsed()-timeLast;
      timeLast=cpu.getUsed(); mainSpawn.run(spawn); timeSpawn += cpu.getUsed()-timeLast;
      timeLast=cpu.getUsed(); mainScout.run(room); timeScout += cpu.getUsed()-timeLast;
    }

  }
  createCreepAdvanced(Game.spawns['Spawn1'],'attacker',createBody({move:4,attack:4}),{targetRoom:'E63S61'});

  if (cpuLog && !Memory.timeData) {Memory.timeData={}}
  var timeHarvester=0;

  timeLast=cpu.getUsed();
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        //try {
          if (cpuLog) {var cpuTime=cpu.getUsed();}
          tasks.scoutRoom(creep);
          if(creep.memory.role == 'harvester') {roleHarvester.run(creep);}
          if(creep.memory.role == 'hauler') {roleHauler.run(creep);}
          if(creep.memory.role == 'spawnHauler') {roleSpawnhauler.run(creep);}
          if(creep.memory.role == 'upgrader') {roleUpgrader.run(creep);}
          if(creep.memory.role == 'builder') {roleBuilder.run(creep);}
          if(creep.memory.role == 'scout') {roleScout.run(creep);}
          if(creep.memory.role == 'warrior') {roleWarrior.run(creep);}
          if(creep.memory.role == 'defender') {roleDefender.run(creep);}
          if(creep.memory.role == 'attacker') {roleAttacker.run(creep);}
          if(creep.memory.role == 'claimer') {roleClaimer.run(creep);}
          if(creep.memory.role == 'remoteBuilder') {roleRemotebuilder.run(creep);}
          if(creep.memory.role == 'remoteHarvester') {roleRemoteHarvester.run(creep);}
          if(creep.memory.role == 'suicide') {roleSuicide.run(creep);}
          if (cpuLog) {
            if (!Memory.timeData[creep.memory.role]) Memory.timeData[creep.memory.role]=[];
            Memory.timeData[creep.memory.role].push(cpu.getUsed()-cpuTime);
          }
      //} catch(err) { Game.notify(err);console.log(err);}
    }
    var timeAI = cpu.getUsed()-timeLast;

    if (cpuLog) {
      timeData=Memory.timeData;
      for (var role in timeData) {
        var avg,tot=0,n=0;
        for (let i=0;i<timeData[role].length;i++) {
          tot+=timeData[role][i];
          n++;
        }
        avg=tot/n;
        console.log(role,',avg: ',avg,'. tot: ',tot)
      }
  }


    console.log('CPU('+cpu.getUsed().toFixed(2)+'): room: '+timeRoom.toFixed(2)+', tower: '+timeTower.toFixed(2)+', spawn: '+timeSpawn.toFixed(2)+', AI: '+timeAI.toFixed(2)+' (har: '+timeHarvester.toFixed(2)+').');

}
