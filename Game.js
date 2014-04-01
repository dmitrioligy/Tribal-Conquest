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

    // Constructor to create Array of Array's of Units
    // All units are set to null  
    this.dead_container = [];
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
        // Based on numbers of players create units
        switch(players)
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
               this.table[Row_Start][P1_Start - 2] = new Unit("Peasant", "P1");
               this.table[Row_Start][P1_Start -  1] = new Unit("Peasant", "P1");
               this.table[Row_Start + 1][P1_Start - 3] = new Unit("Peasant", "P1");
               this.table[Row_Start + 1][P1_Start] = new Unit("Peasant", "P1");
               this.table[Row_Start + 2][P1_Start - 3] = new Unit("Peasant", "P1");
               this.table[Row_Start + 2][P1_Start] = new Unit("Peasant", "P1");

               //--------------------Scout--------------------
               this.table[Row_Start][P1_Start - 3] = new Unit("Scout", "P1");
               this.table[Row_Start][P1_Start] = new Unit("Scout", "P1");
               
               //--------------------King--------------------
               this.table[Row_Start + 2][P1_Start - 2] = new Unit("King", "P1");
               //--------------------Ranger--------------------
               this.table[Row_Start + 2][P1_Start - 1] = new Unit("Ranger", "P1");
               this.table[Row_Start + 1][P1_Start - 2] = new Unit("Ranger", "P1");
               this.table[Row_Start + 1][P1_Start - 1] = new Unit("Ranger", "P1");

               // PLAYER 2 //
               //-------------------Peasant------------------
               this.table[Row_Start][P2_Start - 2] = new Unit("Peasant", "P2");
               this.table[Row_Start][P2_Start -  1] = new Unit("Peasant", "P2");
               this.table[Row_Start + 1][P2_Start - 3] = new Unit("Peasant", "P2");
               this.table[Row_Start + 1][P2_Start] = new Unit("Peasant", "P2");
               this.table[Row_Start + 2][P2_Start - 3] = new Unit("Peasant", "P2");
               this.table[Row_Start + 2][P2_Start] = new Unit("Peasant", "P2");

               //--------------------Scout--------------------
               this.table[Row_Start][P2_Start - 3] = new Unit("Scout", "P2");
               this.table[Row_Start][P2_Start] = new Unit("Scout", "P2");
               
               //--------------------King--------------------
               this.table[Row_Start + 2][P2_Start - 2] = new Unit("King", "P2");
               //--------------------Ranger--------------------
               this.table[Row_Start + 2][P2_Start - 1] = new Unit("Ranger", "P2");
               this.table[Row_Start + 1][P2_Start - 2] = new Unit("Ranger", "P2");
               this.table[Row_Start + 1][P2_Start - 1] = new Unit("Ranger", "P2");
               break;

               default:
               // -- stuff
               break;
           }
           
       };

       this.Add_Player = function(name)
       {
       	if (this.Player_List.length < 4)
       	{	
       		var new_player = { Score: 0, Name: name };
       		this.Player_List.push(new_player);
       	}
       };

	// Score one point to a player
	this.Add_Point = function(player_name)
	{
		// Find which player scored a point
		switch(player_name)
		{
			case "P1":
			this.Player_List[0].Score = this.Player_List[0].Score + 1;
			break;
			case "P2":
			this.Player_List[1].Score = this.Player_List[1].Score + 1;
			break;
			case "P3":
			this.Player_List[2].Score = this.Player_List[2].Score + 1;
			break;
			case "P4":
			this.Player_List[3].Score = this.Player_List[3].Score + 1;
			break;
			default:
			break;
		}
	};

	// Currently player which can make moves/attacks
	this.Player_Turn =  function(Player)
	{
		this.Current_Player = Player;
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

		// Console Display timers
		var current = count;
		if(current != count)
		{
			console.log("count: " + count);
			console.log("timer" + timer);
		}
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

}