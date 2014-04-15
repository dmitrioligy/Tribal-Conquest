/*************************************** 
 *    Grid Class - Creates 2D Table.
 *    Array of Array's of Units.
 *
 ***************************************/
function Game()
{

    // Members
    // this.deadContainer
    // this.table[x][y] is a array of array of Units - refer to Unit class
    // this.playerList - array of players
        // name, index, score, played
    // this.maxScore
    // this.currentPlayer

    // Methods
    // Initialize(players)
    // InitializeUnits(rowStart, playerStart, player)
    // AddPoint(name)
    // TestPrint()    
    // NextTurn() 
    // TestWin()
    // PlayerTimer()
    // RandomBuff()
    // AddBuff(buffName, buffX, buffY)
    // TestPrint()
    // MiddleCheck()
    // ResetUsed()

    // Game Members decleration
    this.playerList = [];
    this.maxScore = 0;
    Array.prototype.playing = null;
    this.deadContainer = [];
    this.winners = new Array(0);

    // Constructor to create Array of Array's of Units
    // All units are set to null
    this.table = new Array(8);
    this.table[0] = new Array(8);
    for(i = 1; i < 8; i++)
    {
        this.table[i] = new Array(24);
    }

    // Fill table with empty cells
    for(j = 0; j < 8; j++)
    {
        this.table[0][j] = new Unit(null, null);
    }
    for(i = 1; i < 8; i++)
    {
        for(j = 0; j < 24; j++)
        {
            this.table[i][j] = new Unit(null, null);
        }
    }

    // Create all the units based on # of players
    this.Initialize = function (players)
    {
        for(var i = 0; i < players.length; i++)
        {
            this.playerList[i] = {
                name: players[i],
                score: 0,
                index: i,
                turn: false,
                played: 0
            };
        }

        // Define who begins first when game begins
        this.playerList[0].turn = true;
        this.playerList.playing = 0;
        this.currentPlayer = this.playerList[0];

        var p1Start, p2Start, p3Start, p4Start;
        var rowStart = 5;
        // Based on numbers of players create units
        switch(players.length)
        {
            // Functional Prototype only has 2 players option
        case 2:
            p1Start = 7;
            p2Start = 19;
            break;
        case 3:
            p1Start = 3;
            p2Start = 11;
            p3Start = 19;
            break;
        case 4:
            p1Start = 7;
            p2Start = 13;
            p3Start = 19;
            p4Start = 1;
            break;
        default:
            // Do nothing
            break;
        }

        // Initialize Units based on Start locations found in switch
        this.InitializeUnits(rowStart, p1Start, this.playerList[0]);
        this.InitializeUnits(rowStart, p2Start, this.playerList[1]);
        if(players.length > 2)
        {
            this.InitializeUnits(rowStart, p3Start, this.playerList[2]);
        }
        if(players.length > 3)
        {
            this.InitializeUnits(rowStart, p4Start, this.playerList[3]);
        }
    };

    // Function to initialize units based on number of players
    this.InitializeUnits = function (rowStart, playerStart, player)
    {
        var playerName = player.name;
        // Column 1 (CCW)
        this.table[rowStart][playerStart] = new Unit("Scout", playerName);
        this.table[rowStart + 1][playerStart] = new Unit("Peasant", playerName);
        this.table[rowStart + 2][playerStart] = new Unit("Peasant", playerName);

        // Column 2
        this.table[rowStart][playerStart - 1] = new Unit("Peasant", playerName);
        this.table[rowStart + 1][playerStart - 1] = new Unit("Ranger", playerName);
        this.table[rowStart + 2][playerStart - 1] = new Unit("Ranger", playerName);

        // Column 3
        // if table wraps around
        if(player.index == 3)
        {
            playerStart = 25;
        }
        this.table[rowStart][playerStart - 2] = new Unit("Peasant", playerName);
        this.table[rowStart + 1][playerStart - 2] = new Unit("Ranger", playerName);
        this.table[rowStart + 2][playerStart - 2] = new Unit("King", playerName);

        // Column 4
        this.table[rowStart][playerStart - 3] = new Unit("Scout", playerName);
        this.table[rowStart + 1][playerStart - 3] = new Unit("Peasant", playerName);
        this.table[rowStart + 2][playerStart - 3] = new Unit("Peasant", playerName);
    };

    // Score one point to a player
    this.AddPoint = function (playerName)
    {
        // Find which player scored a point
        switch(playerName)
        {
        case this.playerList[0].name:

            // Increment Score
            this.playerList[0].score = this.playerList[0].score + 1;

            // If reached max points, game over
            if(this.playerList[0].score == this.maxScore)
            {
                this.winners.push(this.playerList[0].name);
            }
            break;

        case this.playerList[1].name:

            // Increment Score
            this.playerList[1].score = this.playerList[1].score + 1;

            // If reached max points, game over
            if(this.playerList[1].score == this.maxScore)
            {
                this.winners.push(this.playerList[1].name);
            }
            break;
        case this.playerList[2].name:

            // Increment Score
            this.playerList[2].score = this.playerList[2].score + 1;

            // If reached max points, game over
            if(this.playerList[2].score == this.maxScore)
            {
                this.winners.push(this.playerList[2].name);
            }
            break;

        case this.playerList[3].name:

            // Increment Score
            this.playerList[3].score = this.playerList[3].score + 1;

            // If reached max points, game over
            if(this.playerList[3].score == this.maxScore)
            {
                this.winners.push(this.playerList[3].name);
            }
            break;

        default:
            break;
        }
    };

    // Currently player which can make moves/attacks
    this.NextTurn = function ()
    {
        ++this.playerList[this.playerList.playing].played;
        if(this.playerList[this.playerList.playing].played >= 2)
        {
            this.playerList[this.playerList.playing].played = 0;
            this.playerList[this.playerList.playing].turn = false;
            ++this.playerList.playing;
            if(this.playerList.playing >= this.playerList.length)
            {
                this.playerList.playing = 0;
                this.MiddleCheck();
                this.TestWin();
            }
            this.playerList[this.playerList.playing].turn = true;
            this.currentPlayer = this.playerList[this.playerList.playing];
        }
    };

    // test to see who won, and end the game
    this.TestWin = function ()
    {
        for(var i = 0; i < this.playerList.length; i++)
        {
            if(this.playerList[i].score >= this.maxScore)
            {
                console.log(this.maxScore);
                this.winners[this.winners.length] = this.playerList[i].name;
            }
        }
    };

    // The amount of time a player has for their turn
    this.PlayerTimer = function ()
    {
        var count = 10;
        var timer = setInterval(function ()
        {
            $("#counter").html(count--);
            if(count == 1) clearInterval(timer);
        }, 1000);
    };

    // Generates a random buff on the table
    this.RandomBuff = function ()
    {
        // Randomize buff to be generated
        var buffs = ["Damage", "Health", "Speed"]; //need to add rez
        var buffIndex = Math.floor(Math.random() * buffs.length);

        // Buff will spawn randomly within range of row 1-4
        while(true)
        {
            // randomiz a location
            var x = Math.floor(Math.random() * buffs.length + 1);
            var y = Math.floor(Math.random() * 24);

            // if location is empty place buff
            if(this.table[x][y].type == null || this.table[x][y] == undefined)
            {
                //this.AddBuff( buffs[buffIndex], x, y );
                var end = new Array(0);
                end[0] = buffs[buffIndex];
                end[1] = x;
                end[2] = y;
                return end;
            }
        }
    };

    // actually adds the buff to the game
    this.AddBuff = function (buffName, buffX, buffY)
    {
        if(!this.table[buffX][buffY].type)
        {
            this.table[buffX][buffY] = new Unit(buffName);
        }
    };

    // Prints the table as a text to see stats
    this.TestPrint = function ()
    {
        var result = "<table border=1>";
        for(var i = 0; i < this.table.length; i++)
        {
            result = result + "<tr>";
            for(var j = 0; j < this.table[i].length; j++)
            {
                result = result + "<td>" + JSON.stringify(this.table[i][j], null, 4) + "</td>";
            }
            result = result + "</tr>";
        }
        result = result + "</table>";

        return result;
    };

    // Check Score in middle
    this.MiddleCheck = function ()
    {
        var players = new Array(this.playerList.length);
        for(var i = 0; i < players.length; i++)
        {
            players[i] = new Array(0);
        }

        for(var i = 0; i < this.table[0].length; i++)
        {
            // Check middle pizza which units reside
            switch(this.table[0][i].owner)
            {
            case undefined:
                break;
            case this.playerList[0].name:
                players[0].push(this.table[0][i]);
                break;
            case this.playerList[1].name:
                players[1].push(this.table[0][i]);
                break;
            case this.playerList[2].name:
                players[2].push(this.table[0][i]);
                break;
            case this.playerList[3].name:
                players[3].push(this.table[0][i]);
                break;
            default:
                break;
            }
        }

        var maxPlayerNames = new Array(0);
        var maxUnits = 0;
        for(var i = 0; i < players.length; i++)
        {
            if(maxUnits < players[i].length)
            {
                maxPlayerNames = new Array(1);
                maxPlayerNames[0] = players[i][0].owner;
                maxUnits = players[i].length;
            }
            else if(maxUnits == players[i].length && maxUnits > 0)
            {
                maxPlayerNames[1] = players[i][0].owner;
            }
        }
        for(var i = 0; i < maxPlayerNames.length; i++)
        {
            this.AddPoint(maxPlayerNames[i]);
        }
    };

    this.ResetUsed = function ()
    {
        for(var i = 0; i < this.table.length; i++)
        {
            for(var j = 0; j < this.table[i].length; j++)
            {
                if(this.table[i][j].image)
                    this.table[i][j].image.used = false;
            }
        }
    };
}