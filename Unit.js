/*********************
*
*	Unit Class
*
**********************/

function Unit(newType, newOwner)
{
   // Members
   	// 3 Types of units
   	 // Unit Person
       // this.type
       // this.owner
       // this.dmg
       // this.hp
       // this.movePlus
       // this.moveX
       // this.attackPlus
       // this.attackX
       // this.buff = false
       // this.dead bool
   // Unit Buff
   	// this.buff = true
   // Unit null
   	// this.type = null

   // Methods
       // Consturctor Unit(Type, Owner)
       // Take_Damage(dmg)
       // Apply_Buff(buff)
       // Copy_Stats(Unit)
       // Empty       

   // Health Constants
   var peasantHP = 2;
   var scoutHP = 1;
   var rangerHP = 1;
   var kingHP = 2;

   // Create a Unit
   this.type = newType;

    if (newType != null)
    {
   	 	this.owner = newOwner;
    	this.dead = false;
    	this.used = false;
    }
    // set up the unit based on the type
   	switch(newType)
   	{
	   	case "Peasant":
		   	this.dmg = 1;
		   	this.hp = 2;
		   	this.movePlus = 1;
		   	this.moveX = 1;
		   	this.attackPlus = 1;
		   	this.attackX = 1;
		   	this.buff =  false;
		   	this.isRanged = false;
	   		break;
	   	case "Scout":
		   	this.dmg = 1;
		   	this.hp = 1;
		   	this.movePlus = 3;
		   	this.moveX = 0;
		   	this.attackPlus = 0;
		   	this.attackX = 2;
		   	this.buff = false;
		   	this.isRanged = true;
		   	break;
	   	case "Ranger":
		   	this.dmg = 1;
		   	this.hp = 1;
		   	this.movePlus = 0;
		   	this.moveX = 2;
		   	this.attackPlus = 3;
		   	this.attackX = 3;
		   	this.buff = false;
		   	this.isRanged = true;
		   	break;
	   	case "King":
		   	this.dmg = 3;
		   	this.hp = 2;
		   	this.movePlus = 1;
		   	this.moveX = 1;
		   	this.attackPlus = 1;
		   	this.attackX = 1;
		   	this.buff = false;
		   	this.isRanged = false;
	   		break;
	   	case "Rez":
	   		this.buff = true;
	   		break;
	   	case "Damage":
	   		this.buff = true;
	   		break;
	   	case "Speed":
	  	 	this.buff = true;
	   		break;
	   	case "Health":
	  	 	this.buff = true;
	  	 	break;
	   	default:
	 	  	break;
    }
    // function used to copy a unit, used for moving
	this.CopyStats = function(newUnit)
	{
		this.dmg = newUnit.dmg;
		this.hp = newUnit.hp;
		this.movePlus = newUnit.movePlus;
		this.moveX = newUnit.moveX;
		this.attackPlus = newUnit.attackPlus;
		this.attackX = newUnit.attackX;
		this.dead = newUnit.dead;
		this.buff = newUnit.buff;
		this.owner = newUnit.owner;
		this.type = newUnit.type;
		this.isRanged = newUnit.isRanged;
	}

	// Make the unit null
	this.Empty = function()
	{
		this.type = null;
		delete this.dmg;
		delete this.hp;
		delete this.movePlus;
		delete this.moveX;
		delete this.attackPlus;
		delete this.attackX;
		delete this.buff;
		delete this.dead;
		delete this.owner;
		delete this.image.used;
		delete this.isRanged;
	}
	// function for being attacked
	this.TakeDamage = function(damage)
	{
		this.hp = this.hp - damage;
		
		if (this.hp <= 0)
		{
			this.hp == 0;
			this.dead = true;
		}
	};
	// function for appling a buff to a unit
	this.ApplyBuff = function(buff)
	{
		switch(buff.type)
		{
			// rez is not implimented yet
			//case "Rez":
			//	// Click Event on Graveyard
			//	// place unit on row 7 , checking columns 5,4,6,3,7,2,8
			//	// to place the unit down
			//	// generate new Unit with data baed on dead_unit clicked data
			//	// dead_unit.pop() that clicked on unit.
			//	break;

			case "Damage":
				this.dmg = this.dmg*2;
				break;

			case "Speed":
				this.movePlus = this.movePlus*2;
				this.moveX = this.moveX*2;
				break;

			case "Health":
				this.hp = this.hp*2;
				break;
		}
	};
}
