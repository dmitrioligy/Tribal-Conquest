//STARTTT
/*************************************** 
*    Grid Class - Creates 2D Table.
*    Array of Array's of Units.
*    
***************************************/
function Game()
{

    // Members
       // this.dead_container
       // this.table[x][y] is a array of array of Units - refer to Unit class
       // this.Player_List - array of players

       // this.Current_Player

    // Methods
        // Test_Print()
        // Add_Player(name)
        // Add_Point(name)
        // Player_Turn(player)
        // Initialize(players)
        // RandomBuff()
        // Middle_Check() - check middle to see who scores
        // Reset_Used() - reset all units used to false



    // Game Members decleration
    this.Player_List = [];
    Array.prototype.Turn = null;
    this.dead_container = [];
    
    // Constructor to create Array of Array's of Units
    // All units are set to null
    this.table = new Array(8);
    this.table[0] = new Array(8);
    for (i = 1; i < 8; i++) 
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
    	var numOfPlayers = players.length;
    	for(var i=0; i<numOfPlayers; ++i)
    	{
    		this.Player_List[i] = {Name: players[i], Score: 0, Index: i, Turn: false};
    	}
    	this.Player_List[0].Turn = true;
    	this.Player_List.Turn = 0;
    	this.Current_Player = this.Player_List[0];
        // Based on numbers of players create units
        switch(players.length)
        {
        	// Functional Prototype only has 2 players option
        	case 2: 
           	// starting_point is location where units will be generated
				// relative to
				P1_Start = 7; 
				P2_Start = 19;
				Row_Start = 5;
				// PLAYER 1 //
				//-------------------Peasant------------------
				this.table[Row_Start][P1_Start - 2] = new Unit("Peasant", this.Player_List[0].Name);
				this.table[Row_Start][P1_Start -  1] = new Unit("Peasant", this.Player_List[0].Name);
				this.table[Row_Start + 1][P1_Start - 3] = new Unit("Peasant", this.Player_List[0].Name);
				this.table[Row_Start + 1][P1_Start] = new Unit("Peasant", this.Player_List[0].Name);
				this.table[Row_Start + 2][P1_Start - 3] = new Unit("Peasant", this.Player_List[0].Name);
				this.table[Row_Start + 2][P1_Start] = new Unit("Peasant", this.Player_List[0].Name);

				//--------------------Scout--------------------
				this.table[Row_Start][P1_Start - 3] = new Unit("Scout", this.Player_List[0].Name);
				this.table[Row_Start][P1_Start] = new Unit("Scout", this.Player_List[0].Name);

				//--------------------King--------------------
				this.table[Row_Start + 2][P1_Start - 2] = new Unit("King", this.Player_List[0].Name);
				//--------------------Ranger--------------------
				this.table[Row_Start + 2][P1_Start - 1] = new Unit("Ranger", this.Player_List[0].Name);
				this.table[Row_Start + 1][P1_Start - 2] = new Unit("Ranger", this.Player_List[0].Name);
				this.table[Row_Start + 1][P1_Start - 1] = new Unit("Ranger", this.Player_List[0].Name);

				// PLAYER 2 //
				//-------------------Peasant------------------
				this.table[Row_Start][P2_Start - 2] = new Unit("Peasant", this.Player_List[1].Name);
				this.table[Row_Start][P2_Start -  1] = new Unit("Peasant", this.Player_List[1].Name);
				this.table[Row_Start + 1][P2_Start - 3] = new Unit("Peasant", this.Player_List[1].Name);
				this.table[Row_Start + 1][P2_Start] = new Unit("Peasant", this.Player_List[1].Name);
				this.table[Row_Start + 2][P2_Start - 3] = new Unit("Peasant", this.Player_List[1].Name);
				this.table[Row_Start + 2][P2_Start] = new Unit("Peasant", this.Player_List[1].Name);

				//--------------------Scout--------------------
				this.table[Row_Start][P2_Start - 3] = new Unit("Scout", this.Player_List[1].Name);
				this.table[Row_Start][P2_Start] = new Unit("Scout", this.Player_List[1].Name);

				//--------------------King--------------------
				this.table[Row_Start + 2][P2_Start - 2] = new Unit("King", this.Player_List[1].Name);
				//--------------------Ranger--------------------
				this.table[Row_Start + 2][P2_Start - 1] = new Unit("Ranger", this.Player_List[1].Name);
				this.table[Row_Start + 1][P2_Start - 2] = new Unit("Ranger", this.Player_List[1].Name);
				this.table[Row_Start + 1][P2_Start - 1] = new Unit("Ranger", this.Player_List[1].Name);
				break;

				default:
				// -- stuff
				break;
			}
   	};

	//this.Add_Player = function(name)
	//{
	//	console.log(name);
	//	// Add a single player to the game
	//   	if (this.Player_List.length < 4)
	//   	{	   	
	//   		var new_player = { Score: 0, Name: name, Index: null };	   
	//   		new_player["Index"] = this.Player_List[this.Player_List.length-1];
	//   		this.Player_List.push(new_player);
	//   	}
	//   	
	//   	// If the player added was #1 player, they take the first turn
	//   	if (this.Player_List.length == 1)
	//   	{
	//   		// Set Player_List member Turn = to index 0;
	//   		this.Player_List.Turn = 0;
	//   		this.Player_List[0].Turn = true;
	//   		this.Current_Player = this.Player_List[0];
	//   	}
	//   	console.log(this.Player_List[0].Name);
	//};

	// Score one point to a player
	this.Add_Point = function(player_name)
	{
		// Find which player scored a point
		switch(player_name)
		{
			case this.Player_List[0].Name:
				this.Player_List[0].Score = this.Player_List[0].Score + 1;
				if (this.Player_List[0].Score == 10)
				{
					this.Game_Over(this.Player_List[0].Name);
				}
				break;
			case this.Player_List[1].Name:
				this.Player_List[1].Score = this.Player_List[1].Score + 1;
				if (this.Player_List[0].Score == 10)
				{
					this.Game_Over(this.Player_List[0].Name);
				}
				break;
			case this.Player_List[2].Name:
				this.Player_List[2].Score = this.Player_List[2].Score + 1;
				if (this.Player_List[0].Score == 10)
				{
					this.Game_Over(this.Player_List[0].Name);
				}
				break;
			case this.Player_List[3].Name:
				this.Player_List[3].Score = this.Player_List[3].Score + 1;
				if (this.Player_List[0].Score == 10)
				{
					this.Game_Over(this.Player_List[0].Name);
				}
				break;
			default:
				break;
		}

	};

	this.Gane_Over =  function(player)
	{
		// Clear Board
		// player is the winner
	}

	// Currently player which can make moves/attacks
	this.Next_Turn = function()
	{
		// Disable current players turn priveledge
		this.Player_List[this.Player_List.Turn].Turn = false;

		// If turn == max players, cycle back to 0 position of turn
		if (this.Player_List.Turn == (this.Player_List.length - 1) )
		{
			this.Player_List.Turn = 0;

			// Check middle for scores
			this.Middle_Check();
		}

		// else increment turn to next player
		else
		{
			this.Player_List.Turn++;
		}

		// Set Current player one who has the turn available
		this.Current_Player = this.Player_List[this.Player_List.Turn];

		// Enable their turn value
		this.Player_List[this.Player_List.Turn].Turn = true;
	};

	// The amount of time a player has for their turn
	this.Player_Timer = function()
	{
		var count = 10;
		var timer = setInterval(function() 
		{
			$("#counter").html(count--);
			if(count == 1) clearInterval(timer);
		} , 1000);
	}

	// Generates a random buff on the table
	this.RandomBuff = function()
	{
    	// Randomize buff to be generated
    	var buffs = ["Damage", "Health", "Speed", "Rez"];
    	var buff_indx = Math.floor(Math.random()*4);

    	var repeat = false;

    	// Buff will spawn randomly within range of row 1-4
    	do
    	{
    		// randomiza location
    		var x = Math.floor(Math.random()*4 + 1);
    		var y = Math.floor(Math.random()*24);

    		// if location is empty place buff
    		if (this.table[x][y] != null)
    		{
    			this.table[x][y] = new Unit( buffs[buff_indx] );
    			repeat = false;
    		}

    		// not empty, try new coordinates
    		else
    		{	
    			repeat =  true;
    		}

    	} while(repeat == true)
    };

    // Prints the table as a text to see stats
    this.Test_Print = function ()
    {
    	var result = "<table border=1>";
    	for(var i=0; i < this.table.length; i++)
    	{
    		result = result + "<tr>";
    		for(var j=0; j < this.table[i].length; j++)
    		{
    			result = result + "<td>" + JSON.stringify(this.table[i][j], null,4) + "</td>"; 
    		}
    		result = result + "</tr>";
    	}
    	result = result + "</table>";

    	return result;
    };

    // Check Score in middle
    this.Middle_Check = function()
    {
    	var players = new Array(this.Player_List.length);
    	for(var i = 0; i < players.length; i++)
    	{
    		players[i] = new Array(0);
    	}

    	for (var i = 0; i < this.table[0].length; i++)
		{
			// Check middle pizza which units reside
			switch(this.table[0][i].owner)
			{
				case undefined:
					break;
				case this.Player_List[0].Name:
					players[0].push(this.table[0][i]);
					break;
				case this.Player_List[1].Name:
					players[1].push(this.table[0][i]);
					break;
				case this.Player_List[2].Name:
					players[2].push(this.table[0][i]);
					break;
				case this.Player_List[3].Name:
					players[3].push(this.table[0][i]);
					break;
				default:
					break;
			}
    	}

    	var max_player_name;
    	var max_units = 0;
    	for ( var i = 0; i < players.length; i++)
    	{
    		// ***************** FIX ***********************
    		// Needs to allow for score to be added if players tie in # of units
    		if (players.length != 0)
    		{
	    		if (max_units < players[i].length)
	    		{
	    			max_player_name = players[i][0].owner;
	    			max_units = players[i].length;
	    		}
	    	}
    	}

    	if (max_player_name != undefined)
    	{
    		this.Add_Point(max_player_name);
    	}

    };   

    this.Reset_Used = function()
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
