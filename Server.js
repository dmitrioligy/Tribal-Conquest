
// Allows access to local file system.
var fs = require('fs')


// Number of players
var numOfPlayers = 0;

//array of player names
var players = new Array(0);

var static = require('node-static');

var fileServer = new static.Server('./');

var app = require('http').createServer(handler);

var io = require('socket.io').listen(app);

app.listen(10001);

function handler (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response, function (err, result) {
            if (err) { // There was an error serving the file
              {
                response.writeHead("Error serving " + request.url + " - " + err.message);
               return response.end('Error loading index.html!');
              }

                // Respond to the client
                response.writeHead(err.status, err.headers);
                response.end();
            }
        });
    }).resume();
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
      function(message) 
      {
        // This function extracts the player name from the find_game message, stores
        // it to the client object, sends a searching message to the client, and
        // starts the game if there are more than 1 players waiting
        if (message && message.player_name) 
        {
          players[numOfPlayers] = message.player_name;
          numOfPlayers++;
          client.set('player_name', message.player_name);
          client.set('player_number', numOfPlayers);
          client.set('turn_number', 0);
          client.emit('searching','Searching for game...');
          if(numOfPlayers > 1)
          {
      		io.sockets.emit('start_game');
          }
        }
        // When something is wrong, send a find_failed message to the client.
        else {
          client.emit('failed_find_game');//might want to add sending the numOfPlayers & playerNumber
        }
      });


    // Listen to an event called 'play_a_unit'. The client should emit this event when
    // a piece is moved
    client.on
    (
      'play_a_unit',
      function(message) 
      {
        if ( message )
        {
          // client.broadcast.emit sends a message to all other clients
          // to move the piece at the oldLocation to the newLocation
          client.broadcast.emit('sync_client_action', { oldX: message.oldX, oldY: message.oldY,
            newX: message.newX, newY: message.newY });
        }
      }
    );


    // Listen for new players
    client.on
    (
    	'add_player',
    	function(new_player)
    	{
    		// Broadcast to all other players a new player entered
    		client.broadcast.emit('add_player', new_player);
    	}
    );


    // Listen for end of turn
    client.on
    (
    	'next_turn',
    	function()
    	{	
    		// broadcast to others end of turn
    		client.broadcast.emit('next_turn');
    	}
    );
	


  });