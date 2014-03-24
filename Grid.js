/*************************************** 
*    Grid Class - Creates 2D Table
*    Has components that go into table
*    i.e. Cells, Units etc
***************************************/

function Grid()
{
    
    // Create 2D Array table
    this.table = new Array(8);
    this.table[0] = new Array(8);
    for (i = 1; i < 8; i++) 
    {
        this.table[i] = new Array(24);
    }

    // Fill table with empty cells
    var emptyCell = new Cell(null);
    for(j = 0; j < 8; j++)
    {
        this.table[0][j] = emptyCell;
    }
    for(i = 1; i < 8; i++)
    {
        for(j = 0; j < 24; j++) 
        {
            this.table[i][j] = emptyCell;
        }
    }

   var scout = new Unit("Scout");
   var king = new Unit("King");
   var ranger = new Unit("Ranger");
   var peasent = new Unit("Peasent");

   this.Initialize = function(players)
   {
       // Based on numbers of players create units
       switch(players)
        {
        	// Functional Prototype only has 2 players option
            case 2:
                // Create Grid full of units
                // use manual input cells into table
                // table[x][y] = Cell(scout); 
                // etc
                this.table[0][0] = new Cell(scout);
                this.table[0][1] = new Cell(king);
                break;
            default:
                //
                break;
        }
    
    };

    this.Test_Print = function()
    {
        var result = "<table border=1>";
        for(var i=0; i < this.table.length; i++)
        {
            result = result + "<tr>";
            for(var j=0; j < this.table[i].length; j++)
            {
                result = result + "<td>" + this.table[i][j].unit + "</td>"; 
            }
            result = result + "</tr>";
        }
        result = result + "</table>";

        return result;
    };
}


function Cell(Unit)
{
    // Create cell with unit inside
    this.unit = Unit;    
}


function Unit(Type)
{
    this.type = Type;
    
    switch(Type)
    {
        case "Peasant":
            this.dmg = 1;
            this.hp = 2;
            this.movePlus = 1;
            this.moveX = 1;
            this.attackPlus = 1;
            this.attackX = 1;
            break;
        case "Scout":
            this.dmg = 1;
            this.hp = 1;
            this.movePlus = 3;
            this.moveX = 0;
            this.attackPlus = 0;
            this.attackX = 2;
            break;
        case "Ranger":
            this.dmg = 1;
            this.hp = 1;
            this.movePlus = 0;
            this.moveX = 2;
            this.attackPlus = 3;
            this.attackX = 3;
            break;
        case "King":
            this.dmg = 3;
            this.hp = 2;
            this.movePlus = 1;
            this.moveX = 1;
            this.attackPlus = 1;
            this.attackX = 1;
            break;
        default:
            this.dmg = 0;
            this.hp = 0;
            this.movePlus = 0;
            this.moveX = 0;
            this.attackPlus = 0;
            this.attackX = 0;
            break;
    }

}
