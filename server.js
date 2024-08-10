var express = require('express');  
var app = express();  
var server = require('http').createServer(app);
var io = require('socket.io')(server);


var players = {};

var food = {x: 100, y: 100};

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});  



io.on('connection', function(client) {  
	
	console.log('a user connected');
	players[client.id] = {x: 20, y: 20, score: 0, col: 'rgb(255,255,255)'};
	
	
	io.emit('allPlayers', players);
	io.emit('updateFood', food);
	
	
	client.on('moved',function(player){
		players[client.id] = {x: player.x, y: player.y, score: player.score, col: player.col};
		
		io.emit('playerUpdate', client.id, players[client.id]);
	});

	client.on('newFoodPos',function(pos){
		food = {x: pos.x, y: pos.y};
		
		io.emit('updateFood', food);
	});
	
	//if any client disconnects remove them and notify all clients
	client.on('disconnect', function(){
		console.log('a user disconnected');
		delete players[client.id];
		io.emit('allPlayers', players);
	});
});
	
//start our web server and socket.io server listening
server.listen(3000, '0.0.0.0', function(){
 	console.log('listening on *:3000');
});

