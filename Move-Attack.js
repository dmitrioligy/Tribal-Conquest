// Attack(game, unitX, unitY, attackX, attackY)
// Move(game, oldX, oldY, newX, newY)
// Unit Movement
		// IntoPizza(oldcolumn)
		// ExitPizza(oldcolumn)
		// Move_Range(game, row, col)
		// Attack_Range(game, row, col)

Game.prototype.Attack = function (attackX, attackY, defX, defY)
{

	if(this.table[attackX][attackY].owner != this.table[defX][defY].owner)
	{
		var attacker = this.table[attackX][attackY];
		this.table[defX][defY].Take_Damage(attacker.dmg);

		if(this.table[defX][defY].dead == true)
		{
			// copy type and owner stats
			var owner = this.table[defX][defY].owner;
			var type =  this.table[defX][defY].type;

			// Empty unit 
			this.table[defX][defY].Empty();

			// Place dead units type/ownership into dead container
			var dead_unit =  new Unit(type, owner);
			dead_unit.dead = true;
			this.dead_container.push(dead_unit);
		}
	}
};

this.prototype.Move = function (oldX, oldY, newX, newY)
{
	// Rename old and new cell. rename unit to be moved
	var unit_moving = this.table[oldX][oldY];
	var newLoc = this.table[newX][newY];

	// if newLoc is buff, apply buff
	if(newLoc.buff == true)
	{
		unit_moving.ApplyBuff(newLoc.type);
	}

	// unit moves to location
	this.table[newX][newY].Copy_Stats(unit_moving);
	// old location is reset
	this.table[oldX][oldY].Empty();
};

// lincoln's code ------------------------------------------------------------------
IntoPizza = function (oldColumn)
{
	if(oldColumn < 3)
	{
		return 0;
	}
	else if (oldColumn < 6)
	{
		return 1;
	}
	else if (oldColumn < 9)
	{
		return 2;
	}
	else if (oldColumn < 12)
	{
		return 3;
	}
	else if (oldColumn < 15)
	{
		return 4;
	}
	else if (oldColumn < 18)
	{
		return 5;
	}
	else if (oldColumn < 21)
	{
		return 6;
	}
	else
	{
		return 7;
	}
};

ExitPizza = function (oldColumn)
{
	return (oldColumn * 3) + 1;
};

// Move_Range = function (game, row, column)
Game.prototype.Move_Range = function(row, column)
{
	// return array of row/col locations it can move
	var answer = new Array(0);
	unit = (this.table[row][column]);
	var add = 0;
	var maxDistPlus = unit.movePlus;
	var maxDistX = unit.moveX;
  
  
	for(var forward = 1; forward <= maxDistPlus; forward++)
	{
		var newRow = row - forward;
		var newColumn = column;
		
		if( newRow < 0 )
		{
			break;
		}
		else if(newRow == 0)
		{
			newColumn = IntoPizza(column);
		}

		var possible = this.table[newRow][newColumn];
		
		if( possible.buff || possible.type === null) //needs to edit other code or this to make work*********
		{
			answer[add] = [newRow, newColumn];
			add = add + 1;
		}
		else if(unit.type !== "Scout")
		{
			break;
		}
	}


	for(var back = 1; back <= maxDistPlus; back++)
	{
		newRow = row + back;
		newcolumn = column;
		
		if( newRow > 7 ) //DO we want a global variable for max size values*********************************
		{
			break;
		}
		else if(row == 0)
		{
			newColumn = ExitPizza(column);
		}
		
		possible = this.table[newRow][newColumn];
		
		if( possible.buff || possible.type === null) //needs to edit other code or this to make work************
		{
			answer[add] = [newRow, newColumn];
			add = add + 1;
		}
		else if(unit.type !== "Scout")
		{
			break;
		}
	}



	for(var right = 1; right <= maxDistPlus; right++)
	{
		newRow = row;
		newColumn = (column + right) % 24; //DO we want a global variable for max size values*****************
		
		if(row == 0)
		{
			newColumn = (column + right) % 8;
		}
		
		possible = this.table[row][newColumn];
		
		if( possible.buff || possible.type === null) //needs to edit other code or this to make work*********
		{
			answer[add] = [newRow, newColumn];
			add = add + 1;
		}
		else if(unit.type !== "Scout")
		{
			break;
		}
	}



	for(var left = 1; left <= maxDistPlus; left++)
	{
		newRow = row;
		newColumn = column - left; //DO we want a global variable for max size values*****************
		
		if ( newColumn < 0 )
		{
			if( row === 0)
			{
				newColumn = newColumn + 8;
			}
			else
			{
				newColumn = newColumn + 24; //DO we want a global variable for max size values************************
			}
		}
		
		possible = this.table[row][newColumn];
		
		if( possible.buff || possible.type === null) //needs to edit other code or this to make work*********
		{
			answer[add] = [newRow, newColumn];
			add = add + 1;
		}
		else if(unit.type !== "Scout")
		{
			break;
		}
	}



	for(var upLeft = 1; upLeft <= maxDistX; upLeft++)
	{
		newRow = row - upLeft;
		newColumn = column - upLeft;
		
		if ( newRow < 0 )
		{
			break;
		}
		else if(newRow === 0)
		{
			newColumn = IntoPizza(column)-1;
		}
		
		if ( newColumn < 0 )
		{
			if(newRow === 0)
			{
				newColumn = newColumn + 8;
			}
			else
			{
				newColumn = newColumn + 24; //DO we want a global variable for max size values************************
			}
		}

		possible = this.table[newRow][newColumn];
		
		if( possible.buff || possible.type === null) //needs to edit other code or this to make work*********
		{
			answer[add] = [newRow, newColumn];
			add = add + 1;
		}
		else if(unit.type !== "Scout")
		{
			break;
		}
	}

	for(var upRight = 1; upRight <= maxDistX; upRight++)
	{
		newRow = row - upRight;
		newColumn = column + upRight % 23;

		if ( newRow < 0 )
		{
			break;
		}
		else if(newRow === 0)
		{
			newColumn = IntoPizza(column)+1;
			if( newColumn > 7)
			{
				newColumn = newColumn - 8;
			}
		}
		
		if ( newColumn > 23 )
		{
			newColumn = newColumn - 24; //DO we want a global variable for max size values************************
		}
		
		possible = this.table[newRow][newColumn];
		
		if( possible.buff || possible.type === null) //needs to edit other code or this to make work*********
		{
			answer[add] = [newRow, newColumn];
			add = add + 1;
		}
		else if(unit.type !== "Scout")
		{
			break;
		}
	}

	for(var backLeft = 1; backLeft <= maxDistX; backLeft++)
	{
		newRow = row + backLeft;
		newColumn = column - backLeft;
		
		if ( newRow > 7 )
		{
			break;
		}
		if(row === 0)
		{
			newColumn = ExitPizza(column) - backLeft - 1;
		}
		
		if ( newColumn < 0 )
		{
			newColumn = newColumn + 24; //DO we want a global variable for max size values************************
		}
		
		possible = this.table[newRow][newColumn];
		
		if( possible.buff || possible.type === null) //needs to edit other code or this to make work*********
		{
			answer[add] = [newRow, newColumn];
			add = add + 1;
		}
		else if(unit.type !== "Scout")
		{
			break;
		}
	}

	for(var backRight = 1; backRight <= maxDistX; backRight++)
	{
		newRow = row + backRight;
		newColumn = column + backRight;
		
		if ( newRow > 7 )
		{
			break;
		}
		if ( row === 0 )
		{
			newColumn = ExitPizza(column) + backRight + 1;
		}
		if ( newColumn > 23 )
		{
			newColumn = newColumn - 24;
		}
		
		possible = this.table[newRow][newColumn];
		
		if( possible.buff || possible.type === null) //needs to edit other code or this to make work*********
		{
			answer[add] = [newRow, newColumn];
			add = add + 1;
		}
		else if(unit.type !== "Scout")
		{
			break;
		}
	}

	return answer;
};


// Attack_Range = function (game, row, column)
Game.prototype.Attack_Range = function(row, column)
{
	// return array of row/col loctions it can attack
	var answer = new Array(0);
	unit = (this.table[row][column]);
	var maxDistPlus = unit.attackPlus;
	var maxDistX = unit.attackX;
	var add = 0;


	for(var forward = 1; forward <= maxDistPlus; forward++)
	{
		var newRow = row - forward;
		var newColumn = column;
		
		if( newRow < 0 )
		{
			break;
		}
		else if(newRow === 0)
		{
			newColumn = IntoPizza(column);
		}

		var possible = this.table[newRow][newColumn];
		
		if( !possible.buff && possible.type !== null) //needs to edit other code or this to make work*********
		{
			if(possible.owner !== unit.owner)//neds BAD help################################################
			{
				answer[add] = [newRow, newColumn];
				add = add + 1;
			}
			if(unit.type !== "Ranger")
			{
				break; //See if this break works for for loop here $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
			}
		}
	}


	for(var back = 1; back <= maxDistPlus; back++)
	{
		newRow = row + back;
		newcolumn = column;
		
		if( newRow > 7 ) //DO we want a global variable for max size values*********************************
		{
			break;
		}
		else if(row === 0)
		{
			newColumn = ExitPizza(column);
		}
		
		possible = this.table[newRow][newColumn];
		
		if( !possible.buff && possible.type !== null) //needs to edit other code or this to make work*********
		{
			if(possible.owner !== unit.owner)//neds BAD help##############################################
			{
				answer[add] = [newRow, newColumn];
				add = add + 1;
			}
			if(unit.type !== "Ranger")
			{
				break; //See if this break works for for loop here $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
			}
		}
	}



	for(var right = 1; right <= maxDistPlus; right++)
	{
		newRow = row;
		newColumn = column + right % 23; //DO we want a global variable for max size values*****************
		
		if(row === 0)
		{
			newColumn = (column + right) % 7;
		}
		
		possible = this.table[row][newColumn];
		
		if( !possible.buff && possible.type !== null) //needs to edit other code or this to make work*********
		{
			if(possible.owner !== unit.owner)//neds BAD help##############################################
			{
				answer[add] = [newRow, newColumn];
				add = add + 1;
			}
			if(unit.type !== "Ranger")
			{
				break; //See if this break works for for loop here $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
			}
		}
	}



	for(var left = 1; left <= maxDistPlus; left++)
	{
		newRow = row;
		newColumn = column - left; //DO we want a global variable for max size values*****************
		if ( newColumn < 0 )
		{
			if( row === 0)
			{
				newColumn = newColumn + 8;
			}
			else
			{
				newColumn = newColumn + 24; //DO we want a global variable for max size values************************
			}
		}
		
		possible = this.table[row][newColumn];
		
		if( !possible.buff && possible.type !== null) //needs to edit other code or this to make work*********
		{
			if(possible.owner !== unit.owner)//neds BAD help##############################################
			{
				answer[add] = [newRow, newColumn];
				add = add + 1;
			}
			if(unit.type !== "Ranger")
			{
				break; //See if this break works for for loop here $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
			}
		}
	}



	for(var upLeft = 1; upLeft <= maxDistX; upLeft++)
	{
		newRow = row - upLeft;
		newColumn = column - upLeft;
		if ( newRow < 0 )
		{
			break;
		}
		else if( newRow === 0 )
		{
			newColumn = IntoPizza(column)-1;
		}
		if ( newColumn < 0 )
		{
			if(newRow === 0)
			{
				newColumn = newColumn + 8;
			}
			else
			{
				newColumn = newColumn + 24; //DO we want a global variable for max size values************************
			}
		}
		
		possible = this.table[newRow][newColumn];
		
		if( !possible.buff && possible.type !== null) //needs to edit other code or this to make work*********
		{
			if(possible.owner !== unit.owner)//neds BAD help##############################################
			{
				answer[add] = [newRow, newColumn];
				add = add + 1;
			}
			if(unit.type !== "Ranger")
			{
				break; //See if this break works for for loop here $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
			}
		}
	}



	for(var upRight = 1; upRight <= maxDistX; upRight++)
	{
		newRow = row - upRight;
		newColumn = column + upRight % 23;
		if ( newRow < 0 )
		{
			break;
		}
		else if(newRow === 0)
		{
			newColumn = IntoPizza(column)+1;
			
			if( newColumn > 7)
			{
				newColumn = newColumn - 8;
			}
		}
		if ( newColumn > 23 )
		{
		newColumn = newColumn - 24; //DO we want a global variable for max size values************************
		}
		
		possible = this.table[newRow][newColumn];
		
		if( !possible.buff && possible.type !== null) //needs to edit other code or this to make work*********
		{
			if(possible.owner !== unit.owner)//neds BAD help##############################################
			{
				answer[add] = [newRow, newColumn];
				add = add + 1;
			}
			if(unit.type !== "Ranger")
			{
				break; //See if this break works for for loop here $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
			}
		}
	}

	for(var backLeft = 1; backLeft <= maxDistX; backLeft++)
	{
		newRow = row + backLeft;
		newColumn = column - backLeft;
		if ( newRow > 7 )
		{
			break;
		}
		if(row === 0)
		{
			newColumn = ExitPizza(column) - backLeft - 1;
		}
		if ( newColumn < 0 )
		{
			newColumn = newColumn + 24; //DO we want a global variable for max size values************************
		}
	
		possible = this.table[newRow][newColumn];
	
		if( !possible.buff && possible.type !== null) //needs to edit other code or this to make work*********
		{
			if(possible.owner !== unit.owner)//neds BAD help##############################################
			{
				answer[add] = [newRow, newColumn];
				add = add + 1;
			}
			if(unit.type !== "Ranger")
			{
				break; //See if this break works for for loop here $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
			}
		}
	}

	for(var backRight = 1; backRight <= maxDistX; backRight++)
	{
		newRow = row + backRight;
		newColumn = column + upRight;
		if ( newRow > 7 )
		{
			break;
		}
		if(row === 0)
		{
			newColumn = ExitPizza(column) + backRight + 1;
		}
		if(newColumn > 23)
		{
			newColumn = newColumn - 24;
		}
		
		possible = this.table[newRow][newColumn];
		
		if( !possible.buff && possible.type !== null) //needs to edit other code or this to make work*********
		{
			if(possible.owner !== unit.owner)//neds BAD help##############################################
			{
				answer[add] = [newRow, newColumn];
				add = add + 1;
			}
			if(unit.type !== "Ranger")
			{
				break; //See if this break works for for loop here $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
			}
		}
	}
	return answer;
};