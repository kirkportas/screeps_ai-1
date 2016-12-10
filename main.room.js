var buildExtension = require('build.extension');
var buildContainers = require('build.containers');
var buildRoads = require('build.roads');
var buildWalls = require('build.walls');
var buildBase = require('build.base');
var roomLinks = require('room.links');

Room.prototype.work = function(room) {

      global.viewOrders = function(roomName) {
        var targetRoom = "E65S61";
        var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_LEMERGIUM &&order.type == ORDER_BUY &&  Game.market.calcTransactionCost(100, targetRoom, order.roomName) < 300);
        Memory.test=orders;
        orders= _.sortBy(orders, o => -o.price);
        for(var i in orders) {
          var o = orders[i];
          console.log(o.price+" - "+Game.market.calcTransactionCost(100, targetRoom, o.roomName))
        }

        //var res= Game.market.deal(orders[0].id, 100, targetRoom);
        //console.log(res)
      }

      global.viewOrders2 = function(roomName) {
        var targetRoom = "E65S61";
        var amntToBuy=1000;
        var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ENERGY &&order.type == ORDER_SELL &&  Game.market.calcTransactionCost(1000, targetRoom, order.roomName) < 2000);
        Memory.test=orders;
        orders= _.sortBy(orders, o => Game.market.calcTransactionCost(amntToBuy, targetRoom, o.roomName));
        for(var i in orders) {
          var o = orders[i];
          var cost=Game.market.calcTransactionCost(amntToBuy, targetRoom, o.roomName);
          var get = amntToBuy-cost;
          console.log(o.price+" - "+cost+" - "+(amntToBuy-cost)/(o.price*amntToBuy))
        }
        //var res= Game.market.deal(orders[0].id, 100, targetRoom);
        //console.log(res)
      }

      roomLinks.run(room);

      var allHostiles = room.find(FIND_HOSTILE_CREEPS,{filter:(creep)=>{return (creep.getActiveBodyparts(ATTACK)+creep.getActiveBodyparts(RANGED_ATTACK))>0}});
      if (allHostiles.length) {

        console.log("Hostile in "+room.name);
        var triggerSafemode=false;
        var criticalBuildings = room.find(FIND_STRUCTURES,{filter:(structure)=>{return structure.structureType==STRUCTURE_SPAWN||structure.structureType==STRUCTURE_TOWER||structure.structureType==STRUCTURE_STORAGE}});
        //if (room.spawn.hits<room.spawn.hitsMax*0.6) triggerSafemode=true;
        _.forEach(criticalBuildings, function(structure){
          var closest=structure.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
          if (closest) {
            if (structure.pos.inRangeTo(closest,3)) triggerSafemode=true;
          }

        });

        if (triggerSafemode) {
          var value = spawn.room.controller.activateSafeMode();
          console.log('WARNING - ENEMY IN BASE - safemode activated: '+value);
          Game.notify('WARNING - ENEMY IN BASE - safemode activated: '+value);
        }


      }
      /*
      var hostileSpawn = spawn.pos.findInRange(FIND_HOSTILE_CREEPS,4); //
      var hostileConstroller = spawn.room.controller.pos.findInRange(FIND_HOSTILE_CREEPS,4);
      if ((hostileSpawn.length||hostileConstroller.length)) {
        var value = spawn.room.controller.activateSafeMode();
        console.log('WARNING - ENEMY IN BASE - safemode activated: '+value);
        Game.notify('WARNING - ENEMY IN BASE - safemode activated: '+value);
      }
      */

      if (room.memory.allSources===undefined || room.memory.allSources.length===undefined || room.memory.allSources.length===0) {
        console.log('init room');

        var posSpawn = room.find(FIND_MY_SPAWNS)[0].pos;
        var sources = room.find(FIND_SOURCES);

        room.memory.allSources=[];

        for (var i = 0; i < sources.length; i++) {
            var path = posSpawn.findPathTo(sources[i],{range:1})
            var pathLen = path.length;
            var safe=1;
            var x=path[pathLen-1].x;
            var y=path[pathLen-1].y;

            var slots = 0;
            for (var x1=-1;x1<2;x1++) {
                for (var y1=-1;y1<2;y1++) {

                 let items = room.lookAt(sources[i].pos.x+x1,sources[i].pos.y+y1);
                   for (let i=0;i<items.length;i++) {
                       if (items[i].terrain!='wall') {slots++;}
                   }
                }
            }

            //   {id: sources[i].id, len: pathLen}
            room.memory.allSources.push({id: sources[i].id, len: pathLen, safe: safe, slots: slots,miners: [], container: null});

        }
        room.memory.allSources.sort(function(a, b) {
            return (a.len-a.safe*100) - (b.len-b.safe*10);
        });
    }
    //buildWalls.run(room);
    if (room.memory.timeToRecheck===null) room.memory.timeToRecheck=0;
    room.memory.timeToRecheck-=1;
    if (room.memory.timeToRecheck<=0) {
      console.log('checking room');
      var extensions = room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
      var containers = room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }});
      //
      if (room.name=='E65S62') {
        room.memory.wallHitsMax=200000;
        room.memory.wallHitsmin=100000;
        room.memory.bufferenergy=100000;
        room.memory.roomdesign=1;
        room.memory.expand=2;
      } else if (room.name=='E65S61') {
        room.memory.wallHitsMax=200000;
        room.memory.wallHitsmin=100000;
        room.memory.bufferenergy=50000;
        room.memory.roomdesign=1;
        room.memory.expand=1;
      } else if (room.name=='E68S62') {
        room.memory.wallHitsMax=400000;
        room.memory.wallHitsmin=200000;
        room.memory.bufferenergy=50000;
        room.memory.roomdesign=2;
        room.memory.expand=2;
      } else if (room.name=='E66S62') {
        room.memory.wallHitsMax=200000;
        room.memory.wallHitsmin=100000;
        room.memory.bufferenergy=20000;
        room.memory.roomdesign=1;
        room.memory.expand=1;
      } else if (room.name=='E67S65') {
        room.memory.wallHitsMax=40000;
        room.memory.wallHitsmin=20000;
        room.memory.bufferenergy=20000;
        room.memory.roomdesign=2;
        room.memory.expand=1;
      } else {
        room.memory.wallHitsMax=40000;
        room.memory.wallHitsmin=20000;
        room.memory.bufferenergy=20000;
        room.memory.roomdesign=1;
        room.memory.expand=0;
      }

      if (room.memory.roomdesign==1) {
        buildContainers.run(room);
        buildBase.run(room);
        if (containers.length>=1) buildExtension.run(room)
        if (containers.length>=1&&extensions.length>=3) {
          var roads = buildRoads.run(room);
          console.log(room.name,' has ',roads.length, 'roads.')
        }
      }
      if (room.memory.roomdesign==2) {
        buildBase.run(room);
        if (containers.length>=1&&extensions.length>=3) {
          var roads = buildRoads.run(room);
          console.log(room.name,' has ',roads.length, 'roads.')
        }

      }

      room.memory.timeToRecheck=100;
      }
  }
