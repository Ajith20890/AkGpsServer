'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

var message = [];

var id = -1;

wss.on('connection',  function (ws){
  console.log('Client connected');
  id++;
  var obj = {};
  obj.x = 0.0;
  obj.y = 0.0;
  obj.removed = 0;
  message.push( obj);
  // console.log(obj);
  var iid = id;
  
  console.log('Total: ', id, '\n');
  
  ws.on('message', function incoming(data) {
    // Broadcast to everyone else.
	 //data = data.data;
	// console.log(data);
	data = JSON.parse( '['+data+']');
	message[iid].x = data[0];
	message[iid].y = data[1];
	console.log( '{');
	message.forEach( function(i,j){
		console.log( '{ iid: ' , j, i, '\n }');
	});
	console.log( '}');
  });
  
  ws.on('close', function(){
	  message[iid].removed = 1;
	  console.log('Client disconnected');
  });
  
});

// setInterval(() => {
  // wss.clients.forEach((client) => {
    // client.send(new Date().toTimeString());
  // });
// }, 1000);
