
// Allows access to local file system.
var fs = require('fs')

// Number of players
var numOfPlayers = 0;

// number of people connected
var connected = 0;

// Hosts choice of total # of players in game
var host_players_size = 0;
var host_max_score = 0;

// Game in session
var game_active = false;

// First player to join
var host_options = false;

//array of player names
var players = new Array(0);

var static = require('node-static');

var fileServer = new static.Server('./');

var app = require('http').createServer(handler);

var io = require('socket.io').listen(app);

// Local
app.listen(8000); 

// Host
// app.listen(8000);

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

    connected++;
    console.log("Connected: " + connected);

    // if a disconnect occurs
    client.on
    (
        'disconnect',
        function()
        {
          connected--;
          console.log("GAME ACTIVE: " + game_active);
          console.log("Connected: " + connected);

          // Game active and someone left, restart everyones game
          if (game_active == true)
          {
            // Restart Server Information
            numOfPlayers = 0;
            players.length = 0;
            host_options = false;
            game_active = false;

            // Make players restart their page
            io.sockets.emit
            (
              'someone_disconnected'
            );
          }
          
          if (connected < 1)
          {
            host_options = false;
          }
        }
    )


    // Welcome Message, host options to 1st person to connect
    if (game_active == false)
    {
      client.emit
      (
        'welcome', {welcome: 'Welcome to Tribal Conquest',
                     host_options: host_options}
      );
    }

    // 1st player responds with host_found to disable host options to other players
    client.on
    (
      'host_found',
      function()
      {
          host_options = true;
      }
    );


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
          // Host declares number of players in game
          if (numOfPlayers == 0)
          {
            host_players_size = message.num_players;
            host_max_score = message.max_score;
          }

          players[numOfPlayers] = message.player_name;
          numOfPlayers++;
          client.set('player_name', message.player_name);
          client.set('player_number', numOfPlayers);
          client.set('turn_number', 0);
          client.emit('searching','Searching for game...');

          // if Number of players matches host's game size => start game
          if( (numOfPlayers == host_players_size) && (host_options == true) )
          {

            // Start the game
            game_active = true;
      		  io.sockets.emit('start_game', {allPlayers : players, 
                                            max_score: host_max_score});
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
            newX: message.newX, newY: message.newY, owner: message.owner });
        }
      }
    );

    // Listen for end of turn
    client.on
    (
    	'next_turn',
    	function()
    	{	
    		// broadcast to others end of turn
    		io.sockets.emit('next_turn');
    	}
    );
	


  });