// The node.js HTTP server.
var app = require('http').createServer(handler);

// The socket.io WebSocket server, running with the node.js server.
var io = require('socket.io').listen(app);

// Allows access to local file system.
var fs = require('fs')

// Listen on a high port.
app.listen(10001);

// Number of players
var numOfPlayers = 0;

//array of player names
var players = new Array(0);

// Handles HTTP requests.
function handler(request, response) {
  // This will read the file 'menu.html', and call the function (the 2nd
  // argument) to process the content of the file.
  // __dirname is a preset variable pointing to the folder of this file.
  fs.readFile(
    __dirname + '/menu.html',
    function(err, content) {
      if (err) {
        // If an error happened when loading 'menu.html', return a 500 error.
        response.writeHead(500);
        return response.end('Error loading menu.html!');
      }
      // If no error happened, return the content of 'menu.html'
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(content);
    });
}

io.sockets.on(
  'connection',
  function(client) {
    // Send a welcome message first.
    client.emit('welcome', 'Welcome to Tribal Conquest');

    // Listen to an event called 'find_game'. The client should emit this event when
    // it wants to find a game
    client.on(
      'find_game',
      function(message) {
        // This function extracts the player name from the find_game message, stores
        // it to the client object, sends a searching message to the client, and
        // starts the game if there are more than 1 players waiting
        if (message && message.player_name) {
          players[numOfPlayers] = message.player_name;
          numOfPlayers++;
          client.set('player_name', message.player_name);
          client.set('player_number', numOfPlayers);
          client.set('turn_number', 0);
          client.emit('searching','Searching for game...');
          if(numOfPlayers > 1){
            io.sockets.emit('start_game');
          }
        }
        // When something is wrong, send a find_failed message to the client.
        else {
          client.emit('failed_find_game');//might want to add sending the numOfPlayers & playerNumber
        }
      });


    // Listen to an event called 'move_piece'. The client should emit this event when
    // a piece is moved
    client.on(
      'move_piece',
      function(message) {
        if ( message ) {
          // client.broadcast.emit sends a message to all other clients
          // to move the piece at the oldLocation to the newLocation
          client.broadcast.emit('move_piece', { oldX: message.oldX, oldY: message.oldY,
            newX: message.newX, newY: message.newY });
        }
      });

    // Listen to an event called 'attack'. The client should emit this event when
    // a unit wants to attack another unit
    client.on(
      'attack',
      function(message){
        if(message) {
          // client.broadcast.emit sends a message to all other clients
          // to make the unit at unitLocation to attack the unit at attackLocation
          client.broadcast.emit('attack',{ unitLocationX: message.unitLocationX, unitLocationY: message.unitLocationY,
            attackLocationX: message.attackLocationX, attackLocationY: message.attackLocationY});
        }
      }
      );

  });
