// Attack( unitX, unitY, attackX, attackY)
// Move( oldX, oldY, newX, newY)
// Unit Movement
// IntoPizza(oldcolumn)
// ExitPizza(oldcolumn)
// MoveRange(row, col)
// AttackRange(row, col)
Game.prototype.Attack = function (attackX, attackY, defX, defY)
{
    // takes in the this attacking unit's x, attacking unit's y, 
    // defending unit's x, defending unit's y and 
    var attacker = this.table[attackX][attackY];
    var defender = this.table[defX][defY];
    // if the attacker is playing, &&
    // both units are not owned by the same person && the attacker is the one who is playing
    if (attacker.owner == this.playerList[this.playerList.playing].name &&
        attacker.owner != defender.owner)
    {
        // do the damage
        this.table[defX][defY].TakeDamage(attacker.dmg);
        // if the unit died
        if (this.table[defX][defY].dead == true)
        {
            // Place dead units type/ownership into dead container
            var deadUnit = new Unit(defender.type, defender.owner);
            deadUnit.dead = true;
            this.deadContainer.push(deadUnit);
            // if the attack was ranged, empty the dead units cell
            if (attacker.isRanged)
            {
                // Empty unit 
                this.table[defX][defY].Empty();
            }
            // otherwise move the unit to the cell
            else
            {
                this.table[defX][defY].CopyStats(attacker);
                this.table[attackX][attackY].Empty();
            }
        }
        // update the turn
        this.NextTurn();
        return true;
    }
};

Game.prototype.Move = function (oldX, oldY, newX, newY)
{// funciton takes in a units coordinates, and moves the unit to the new coordinates

    // copy the units for ease of use
    var unitMoving = this.table[oldX][oldY];
    var newLoc = this.table[newX][newY];

    // if newLoc is a buff, apply the buff
    if (newLoc.buff == true)
    {
        unitMoving.ApplyBuff(newLoc);
    }

    // unit moves to location
    this.table[newX][newY].CopyStats(unitMoving);
    // old location is reset
    this.table[oldX][oldY].Empty();
    //update turn
    this.NextTurn();
    return true;
};

// lincoln's code ------------------------------------------------------------------
IntoPizza = function (oldColumn)
{   // input the current column, and the function returns the
    // coresponding column that is inside the pizza
    if (oldColumn < 3)
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
    //input the current column that is inside the pizza
    // and return the coresponding column that is directly behind it
    return (oldColumn * 3) + 1;
};

Game.prototype.MoveRange = function (row, column)
{
    // input the this state, the row, and column of the unit selected
    // returns array of arrays, the first parameter is the number of possible locations
    // the second paramater is the x (answer[][0] = x location)
    // and the second is the y (answer[][1] = y location)
    // took a brute force approach since the for loops are not very big
    var answer = new Array(0);
    unit = (this.table[row][column]);
    var add = 0;
    var maxDistPlus = unit.movePlus;
    var maxDistX = unit.moveX;

    //adds all possible moves going directly forward
    for (var forward = 1; forward <= maxDistPlus; forward++)
    {
        var newRow = row - forward;
        var newColumn = column;
        if (newRow < 0)
        {
            break;
        }
        else if (newRow == 0)
        {
            newColumn = IntoPizza(column);
        }
        var possible = this.table[newRow][newColumn];
        if (possible.buff || possible.type === null)
        {
            answer[add] = [newRow, newColumn];
            add = add + 1;
        }
        else if (unit.type !== "Scout")
        {
            break;
        }
    }

    // adds all possible moves going directly backward
    // if in pizza backwards is different
    if (row === 0)
    {
        for (var i = 0; i < 3; i++)
        {
            for (var back = 1; back <= maxDistPlus; back++)
            {
                newRow = row + back;
                if (i == 0)
                {
                    newColumn = ExitPizza(column) - 1;
                }
                else if (i == 1)
                {
                    newColumn = ExitPizza(column);
                }
                else
                {
                    newColumn = ExitPizza(column) + 1;
                }
                possible = this.table[newRow][newColumn];
                if (possible.buff || possible.type === null) //needs to edit other code or this to make work************
                {
                    answer[add] = [newRow, newColumn];
                    add = add + 1;
                }
                else if (unit.type !== "Scout")
                {
                    break;
                }

            }
        }
    }
    else // if not in pizza then use this function
    {
        for (var back = 1; back <= maxDistPlus; back++)
        {
            newRow = row + back;
            newColumn = column;
            if (newRow > 7) //DO we want a global variable for max size values*********************************
            {
                break;
            }
            possible = this.table[newRow][newColumn];
            if (possible.buff || possible.type === null) //needs to edit other code or this to make work************
            {
                answer[add] = [newRow, newColumn];
                add = add + 1;
            }
            else if (unit.type !== "Scout")
            {
                break;
            }
        }
    }

    //adds all possible moves going directly to the right
    for (var right = 1; right <= maxDistPlus; right++)
    {
        newRow = row;
        newColumn = (column + right) % 24; //DO we want a global variable for max size values*****************
        if (row == 0)
        {
            newColumn = (column + right) % 8;
        }
        possible = this.table[row][newColumn];
        if (possible.buff || possible.type === null) //needs to edit other code or this to make work*********
        {
            answer[add] = [newRow, newColumn];
            add = add + 1;
        }
        else if (unit.type !== "Scout")
        {
            break;
        }
    }

    //adds all possible moves going directly to the left	
    for (var left = 1; left <= maxDistPlus; left++)
    {
        newRow = row;
        newColumn = column - left; //DO we want a global variable for max size values*****************
        if (newColumn < 0)
        {
            if (row === 0)
            {
                newColumn = newColumn + 8;
            }
            else
            {
                newColumn = newColumn + 24; //DO we want a global variable for max size values************************
            }
        }
        possible = this.table[row][newColumn];
        if (possible.buff || possible.type === null) //needs to edit other code or this to make work*********
        {
            answer[add] = [newRow, newColumn];
            add = add + 1;
        }
        else if (unit.type !== "Scout")
        {
            break;
        }
    }

    //adds all possible moves going diagonally forward and left
    for (var upLeft = 1; upLeft <= maxDistX; upLeft++)
    {
        newRow = row - upLeft;
        newColumn = column - upLeft;
        if (newRow < 0)
        {
            break;
        }
        if (newColumn < 0)
        {
            newColumn = newColumn + 24; //DO we want a global variable for max size values************************
        }
        if (newRow === 0)
        {
            newColumn = IntoPizza(newColumn);
        }
        possible = this.table[newRow][newColumn];
        if (possible.buff || possible.type === null) //needs to edit other code or this to make work*********
        {
            answer[add] = [newRow, newColumn];
            add = add + 1;
        }
        else if (unit.type !== "Scout")
        {
            break;
        }
    }

    //adds all possible moves going diagonally forward and right
    for (var upRight = 1; upRight <= maxDistX; upRight++)
    {
        newRow = row - upRight;
        newColumn = column + upRight % 23;
        if (newRow < 0)
        {
            break;
        }
        if (newColumn > 23)
        {
            newColumn = newColumn - 24;
        }
        if (newRow === 0)
        {
            newColumn = IntoPizza(newColumn);
        }
        if (newColumn > 23)
        {
            newColumn = newColumn - 24; //DO we want a global variable for max size values************************
        }
        possible = this.table[newRow][newColumn];
        if (possible.buff || possible.type === null) //needs to edit other code or this to make work*********
        {
            answer[add] = [newRow, newColumn];
            add = add + 1;
        }
        else if (unit.type !== "Scout")
        {
            break;
        }
    }

    //adds all possible moves going diagonally back and left
    for (var backLeft = 1; backLeft <= maxDistX; backLeft++)
    {
        newRow = row + backLeft;
        newColumn = column - backLeft;
        if (newRow > 7)
        {
            break;
        }
        if (row === 0)
        {
            newColumn = ExitPizza(column) - backLeft - 1;
        }
        if (newColumn < 0)
        {
            newColumn = newColumn + 24; //DO we want a global variable for max size values************************
        }
        possible = this.table[newRow][newColumn];
        if (possible.buff || possible.type === null) //needs to edit other code or this to make work*********
        {
            answer[add] = [newRow, newColumn];
            add = add + 1;
        }
        else if (unit.type !== "Scout")
        {
            break;
        }
    }

    //adds all possible moves going diagonallly back and to the right
    for (var backRight = 1; backRight <= maxDistX; backRight++)
    {
        newRow = row + backRight;
        newColumn = column + backRight;
        if (newRow > 7)
        {
            break;
        }
        if (row === 0)
        {
            newColumn = ExitPizza(column) + backRight + 1;
        }
        if (newColumn > 23)
        {
            newColumn = newColumn - 24;
        }
        possible = this.table[newRow][newColumn];
        if (possible.buff || possible.type === null) //needs to edit other code or this to make work*********
        {
            answer[add] = [newRow, newColumn];
            add = add + 1;
        }
        else if (unit.type !== "Scout")
        {
            break;
        }
    }

    return answer;
};

Game.prototype.AttackRange = function (row, column)
{
    // input the this state, the row, and column of the unit selected
    // returns a 3 deminsional array, the first paramater (answer[a][][])
    // is either 0 or 1, 0 = possible attacks, 1 = attack range with empty units
    // the second paramater (answer[][a][]) is the number of possible attacks/empty
    // units in range, and the thir paramter (answer[][][a]) is the x (a=0)
    // and y (a=1) locaiton of the unit
    var answer = new Array(2);
    answer[0] = new Array(0);
    answer[1] = new Array(0);
    unit = (this.table[row][column]);
    var maxDistPlus = unit.attackPlus;
    var maxDistX = unit.attackX;
    var can = 0;
    cant = 0;

    var canAttack = true;
    //adds all possible attacks going directly forward
    for (var forward = 1; forward <= maxDistPlus; forward++)
    {
        var newRow = row - forward;
        var newColumn = column;
        if (newRow < 0)
        {
            break;
        }
        else if (newRow == 0)
        {
            newColumn = IntoPizza(column);
        }
        var possible = this.table[newRow][newColumn];
        if (canAttack && !possible.buff &&
            possible.type !== null && possible.owner !== unit.owner)
        {
            answer[0][can] = [newRow, newColumn];
            can++;
            if (unit.type !== "Ranger")
            {
                canAttack = false;
            }
        }
        else
        {
            answer[1][cant] = [newRow, newColumn];
            cant++;
        }
    }

    // adds all possible attacks going directly backward
    // if in pizza, backwards is different
    canAttack = true;
    if (row === 0)
    {
        for (var i = 0; i < 3; i++)
        {
            for (var back = 1; back <= maxDistPlus; back++)
            {
                newRow = row + back;
                if (i == 0)
                {
                    newColumn = ExitPizza(column) - 1;
                }
                else if (i == 1)
                {
                    newColumn = ExitPizza(column);
                }
                else
                {
                    newColumn = ExitPizza(column) + 1;
                }
                possible = this.table[newRow][newColumn];
                if (canAttack && !possible.buff &&
                    possible.type !== null && possible.owner !== unit.owner)
                {
                    answer[0][can] = [newRow, newColumn];
                    can++;
                    if (unit.type !== "Ranger")
                    {
                        canAttack = false;
                    }
                }
                else
                {
                    answer[1][cant] = [newRow, newColumn];
                    cant++;
                }
            }
        }
    }
    else // if not in pizza then use this function
    {
        for (var back = 1; back <= maxDistPlus; back++)
        {
            newRow = row + back;
            newColumn = column;
            if (newRow > 7) //DO we want a global variable for max size values*********************************
            {
                break;
            }
            possible = this.table[newRow][newColumn];
            if (canAttack && !possible.buff &&
                possible.type !== null && possible.owner !== unit.owner)
            {
                answer[0][can] = [newRow, newColumn];
                can++;
                if (unit.type !== "Ranger")
                {
                    canAttack = false;
                }
            }
            else
            {
                answer[1][cant] = [newRow, newColumn];
                cant++;
            }
        }
    }

    canAttack = true;
    //adds all possible attacks going directly to the right
    for (var right = 1; right <= maxDistPlus; right++)
    {
        newRow = row;
        newColumn = (column + right) % 24; //DO we want a global variable for max size values*****************
        if (row == 0)
        {
            newColumn = (column + right) % 8;
        }
        possible = this.table[newRow][newColumn];
        if (canAttack && !possible.buff &&
            possible.type !== null && possible.owner !== unit.owner)
        {
            answer[0][can] = [newRow, newColumn];
            can++;
            if (unit.type !== "Ranger")
            {
                canAttack = false;
            }
        }
        else
        {
            answer[1][cant] = [newRow, newColumn];
            cant++;
        }
    }

    canAttack = true;
    // adds all possible attacks going directly to the left
    for (var left = 1; left <= maxDistPlus; left++)
    {
        newRow = row;
        newColumn = column - left; //DO we want a global variable for max size values*****************
        if (newColumn < 0)
        {
            if (row === 0)
            {
                newColumn = newColumn + 8;
            }
            else
            {
                newColumn = newColumn + 24; //DO we want a global variable for max size values************************
            }
        }
        possible = this.table[newRow][newColumn];
        if (canAttack && !possible.buff &&
            possible.type !== null && possible.owner !== unit.owner)
        {
            answer[0][can] = [newRow, newColumn];
            can++;
            if (unit.type !== "Ranger")
            {
                canAttack = false;
            }
        }
        else
        {
            answer[1][cant] = [newRow, newColumn];
            cant++;
        }
    }

    canAttack = true;
    // adds all possible attacks going diagonally forward and to the left
    for (var upLeft = 1; upLeft <= maxDistX; upLeft++)
    {
        newRow = row - upLeft;
        newColumn = column - upLeft;
        if (newRow < 0)
        {
            break;
        }
        if (newColumn < 0)
        {
            newColumn = newColumn + 24; //DO we want a global variable for max size values************************
        }
        if (newRow === 0)
        {
            newColumn = IntoPizza(newColumn);
        }
        possible = this.table[newRow][newColumn];
        if (canAttack && !possible.buff &&
            possible.type !== null && possible.owner !== unit.owner)
        {
            answer[0][can] = [newRow, newColumn];
            can++;
            if (unit.type !== "Ranger")
            {
                canAttack = false;
            }
        }
        else
        {
            answer[1][cant] = [newRow, newColumn];
            cant++;
        }
    }

    canAttack = true;
    // adds all possible attacks going diagonally forward and to the right
    for (var upRight = 1; upRight <= maxDistX; upRight++)
    {
        newRow = row - upRight;
        newColumn = column + upRight % 23;
        if (newRow < 0)
        {
            break;
        }
        if (newColumn > 23)
        {
            newColumn = newColumn - 24;
        }
        if (newRow === 0)
        {
            newColumn = IntoPizza(newColumn);
        }
        if (newColumn > 23)
        {
            newColumn = newColumn - 24; //DO we want a global variable for max size values************************
        }
        possible = this.table[newRow][newColumn];
        if (canAttack && !possible.buff &&
            possible.type !== null && possible.owner !== unit.owner)
        {
            answer[0][can] = [newRow, newColumn];
            can++;
            if (unit.type !== "Ranger")
            {
                canAttack = false;
            }
        }
        else
        {
            answer[1][cant] = [newRow, newColumn];
            cant++;
        }
    }

    canAttack = true;
    // adds all possible attacks going diagonally backwards and to the left
    for (var backLeft = 1; backLeft <= maxDistX; backLeft++)
    {
        newRow = row + backLeft;
        newColumn = column - backLeft;
        if (newRow > 7)
        {
            break;
        }
        if (row === 0)
        {
            newColumn = ExitPizza(column) - backLeft - 1;
        }
        if (newColumn < 0)
        {
            newColumn = newColumn + 24; //DO we want a global variable for max size values************************
        }
        possible = this.table[newRow][newColumn];
        if (canAttack && !possible.buff &&
            possible.type !== null && possible.owner !== unit.owner)
        {
            answer[0][can] = [newRow, newColumn];
            can++;
            if (unit.type !== "Ranger")
            {
                canAttack = false;
            }
        }
        else
        {
            answer[1][cant] = [newRow, newColumn];
            cant++;
        }
    }

    canAttack = true;
    // adds all possible attacks going diagonally backwards and to the right
    for (var backRight = 1; backRight <= maxDistX; backRight++)
    {
        newRow = row + backRight;
        newColumn = column + backRight;
        if (newRow > 7)
        {
            break;
        }
        if (row === 0)
        {
            newColumn = ExitPizza(column) + backRight + 1;
        }
        if (newColumn > 23)
        {
            newColumn = newColumn - 24;
        }
        possible = this.table[newRow][newColumn];
        if (canAttack && !possible.buff &&
            possible.type !== null && possible.owner !== unit.owner)
        {
            answer[0][can] = [newRow, newColumn];
            can++;
            if (unit.type !== "Ranger")
            {
                canAttack = false;
            }
        }
        else
        {
            answer[1][cant] = [newRow, newColumn];
            cant++;
        }
    }

    return answer;
};
