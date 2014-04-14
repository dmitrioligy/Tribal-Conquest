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
       // this.Max_Score
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
    this.Max_Score = 0;
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
    	for(var i = 0; i < players.length; i++)
    	{
    		this.Player_List[i] = {Name: players[i], Score: 0, Index: i, Turn: false, Played: 0};
    	}

    	// Define who begins first when game begins
    	this.Player_List[0].Turn = true;
    	this.Player_List.Playing = 0;
    	this.Current_Player = this.Player_List[0];


    	var P1_Start, P2_Start, P3_Start, P4_Start;
    	var Row_Start = 5;
        // Based on numbers of players create units
        switch(players.length)
        {
        	// Functional Prototype only has 2 players option
        	case 2: 
				P1_Start = 7; 
				P2_Start = 19;				
				break;
			case 3:
				P1_Start = 3; 
				P2_Start = 11;
				P3_Start = 19;
				break;
			case 4:
				P1_Start = 7; 
				P2_Start = 19;
				P3_Start = 13;
				P4_Start = 1;
				break;
			default:
				// Do nothing
				break;
		}
 
		// Initialize Units based on Start locations found in switch
		this.Initialize_Units(Row_Start, P1_Start, this.Player_List[0]);
		this.Initialize_Units(Row_Start, P2_Start, this.Player_List[1]);
		if (players.length > 2)
		{
			this.Initialize_Units(Row_Start, P3_Start, this.Player_List[2]);
		}
		if (players.length > 3)
		{
			this.Initialize_Units(Row_Start, P4_Start, this.Player_List[3]);
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

				// Increment Score
				this.Player_List[0].Score = this.Player_List[0].Score + 1;

				// If reached max points, game over
				if (this.Player_List[0].Score == this.Max_Score)
				{
					// if my name == winner, display win screen
					if (window.name == this.Player_List[0].Name)
					{
						Render.Win(window.name);
					}
					// if my name != winner, display lose screen
					else
					{
						Render.Lose(window.name);
					}
				}
				break;

			case this.Player_List[1].Name:

				// Increment Score
				this.Player_List[1].Score = this.Player_List[1].Score + 1;
				
				// If reached max points, game over
				if (this.Player_List[1].Score == this.Max_Score)
				{
					// if my name == winner, display win screen
					if (window.name == this.Player_List[1].Name)
					{
						Render.Win(window.name);
					}
					// if my name != winner, display lose screen
					else
					{
						Render.Lose(window.name);
					}
				}
				break;
			case this.Player_List[2].Name:

				// Increment Score
				this.Player_List[2].Score = this.Player_List[2].Score + 1;
			
				// If reached max points, game over
				if (this.Player_List[2].Score == this.Max_Score)
				{
					// if my name == winner, display win screen
					if (window.name == this.Player_List[2].Name)
					{
						Render.Win(window.name);
					}
					// if my name != winner, display lose screen
					else
					{
						Render.Lose(window.name);
					}
				}
				break;

			case this.Player_List[3].Name:

				// Increment Score
				this.Player_List[3].Score = this.Player_List[3].Score + 1;

				// If reached max points, game over
				if (this.Player_List[3].Score == this.Max_Score)
				{
					// if my name == winner, display win screen
					if (window.name == this.Player_List[3].Name)
					{
						Render.Win(window.name);
					}
					// if my name != winner, display lose screen
					else
					{
						Render.Lose(window.name);
					}
				}
				break;

			default:
				break;
		}

	};


	// Currently player which can make moves/attacks
	this.Next_Turn = function()
	{
		++this.Player_List[this.Player_List.Playing].Played;
		if( this.Player_List[this.Player_List.Playing].Played >= 2 )
		{
			this.Player_List[this.Player_List.Playing].Played = 0;
			this.Player_List[this.Player_List.Playing].Turn = false;
			++this.Player_List.Playing;
			if( this.Player_List.Playing >= this.Player_List.length )
			{
				this.Player_List.Playing = 0;
				this.Middle_Check();
			}
			this.Player_List[this.Player_List.Playing].Turn = true;
			this.Current_Player = this.Player_List[this.Player_List.Playing];
		}
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
    		// randomiz a location
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

    	var max_player_names = new Array(0);
    	var max_units = 0;
    	for ( var i = 0; i < players.length; i++)
    	{
    		// ***************** FIX ***********************
    		// Needs to allow for score to be added if players tie in # of units
    		if (max_units < players[i].length)
    		{
    			max_player_names = new Array(1);
    			max_player_names[0] = players[i][0].owner;
    			max_units = players[i].length;
    		}
    		else if (max_units == players[i].length && max_units > 0)
    		{
    			max_player_names[1] = players[i][0].owner;
    		}
    	}
    	for(var i=0; i<max_player_names.length; i++)
    	{
    		this.Add_Point(max_player_names[i]);
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

// Function to initialize units based on number of players
Game.prototype.Initialize_Units = function(row_start, player_start, player)
{
	var player_name = player.Name;
	// Column 1 (CCW)
	this.table[row_start][player_start] = new Unit("Scout", player_name);
	this.table[row_start + 1][player_start] = new Unit("Peasant", player_name);
	this.table[row_start + 2][player_start] = new Unit("Peasant", player_name);
	
	// Column 2
	this.table[row_start][player_start -  1] = new Unit("Peasant", player_name);
	this.table[row_start + 1][player_start - 1] = new Unit("Ranger", player_name);	
	this.table[row_start + 2][player_start - 1] = new Unit("Ranger", player_name);	

	// Column 3
	// if table wraps around
	if ( player.Index == 3 )
	{
		player_start = 25;
	}
	this.table[row_start][player_start - 2] = new Unit("Peasant", player_name);
	this.table[row_start + 1][player_start - 2] = new Unit("Ranger", player_name);
	this.table[row_start + 2][player_start - 2] = new Unit("King", player_name);

	// Column 4
	this.table[row_start][player_start - 3] = new Unit("Scout", player_name);
	this.table[row_start + 1][player_start - 3] = new Unit("Peasant", player_name);
	this.table[row_start + 2][player_start - 3] = new Unit("Peasant", player_name);	
}
