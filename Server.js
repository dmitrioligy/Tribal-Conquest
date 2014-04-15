// Allows access to local file system.
var fs = require('fs')

// Number of players
var numOfPlayers = 0;

// number of people connected
var connected = 0;

// Hosts choice of total # of players in game
var hostPlayerSize = 0;
var hostMaxScore = 0;

// Game in session
var gameActive = false;

// First player to join
var hostOptions = false;

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

function handler(request, response)
{
    request.addListener('end', function ()
    {
        fileServer.serve(request, response, function (err, result)
        {
            if(err)
            { // There was an error serving the file
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
    function (client)
    {

        connected++;
        console.log("Connected: " + connected);

        // if a disconnect occurs
        client.on(
            'disconnect',
            function ()
            {
                connected--;
                console.log("GAME ACTIVE: " + gameActive);
                console.log("Connected: " + connected);

                // Game active and someone left, restart everyones game
                if(gameActive == true)
                {
                    // Restart Server Information
                    numOfPlayers = 0;
                    players.length = 0;
                    hostOptions = false;
                    gameActive = false;

                    // Make players restart their page
                    io.sockets.emit(
                        'someone_disconnected'
                    );
                }

                if(connected < 1)
                {
                    hostOptions = false;
                }
            }
        )

        // Welcome Message, host options to 1st person to connect
        if(gameActive == false)
        {
            client.emit(
                'welcome',
                {
                    welcome: 'Welcome to Tribal Conquest',
                    hostOptions: hostOptions
                }
            );
        }

        // 1st player responds with host_found to disable host options to other players
        client.on(
            'host_found',
            function ()
            {
                hostOptions = true;
            }
        );

        // Listen to an event called 'find_game'. The client should emit this event when
        // it wants to find a game
        client.on(
            'find_game',
            function (message)
            {
                // This function extracts the player name from the find_game message, stores
                // it to the client object, sends a searching message to the client, and
                // starts the game if there are more than 1 players waiting
                if(message && message.playerName)
                {
                    // Host declares number of players in game
                    if(numOfPlayers == 0)
                    {
                        hostPlayerSize = message.num_players;
                        hostMaxScore = message.maxScore;
                    }

                    players[numOfPlayers] = message.playerName;
                    numOfPlayers++;
                    client.set('player_name', message.playerName);
                    client.set('player_number', numOfPlayers);
                    client.set('turn_number', 0);
                    client.emit('searching', 'Searching for game...');

                    // if Number of players matches host's game size => start game
                    if((numOfPlayers == hostPlayerSize) && (hostOptions == true))
                    {
                        // Start the game
                        gameActive = true;
                        io.sockets.emit('start_game',
                        {
                            allPlayers: players,
                            maxScore: hostMaxScore
                        });
                    }
                }

                // When something is wrong, send a find_failed message to the client.
                else
                { 
                    //might want to add sending the numOfPlayers & playerNumber
                    client.emit('failed_find_game');
                }
            });

        // Listen to an event called 'play_a_unit'. The client should emit this event when
        // a piece is moved
        client.on(
            'play_a_unit',
            function (message)
            {
                if(message)
                {
                    // client.broadcast.emit sends a message to all other clients
                    // to move the piece at the oldLocation to the newLocation
                    client.broadcast.emit('sync_client_action',
                    {
                        oldX: message.oldX,
                        oldY: message.oldY,
                        newX: message.newX,
                        newY: message.newY,
                        owner: message.owner
                    });
                }
            }
        );

        // Listen for "synch_buff", which the host should emit to tell all other clients
        // to add the buf (buffName) to the location (buffX, buffY)
        client.on(
            'synch_buff',
            function (message)
            {
                if(message)
                {
                    // send the new buff to everyone
                    io.sockets.emit('synch_buff',
                    {
                        buffName: message.buffName,
                        buffX: message.buffX,
                        buffY: message.buffY
                    });
                }
            }
        );
    }
);