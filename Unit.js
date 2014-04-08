/*********************
*
*	Unit Class
*
**********************/

function Unit(Type, Owner)
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
   var PeasantHP = 2;
   var ScoutHP = 1;
   var RangerHP = 1;
   var KingHP = 2;

   // Create a Unit
   this.type = Type;

    if (Type != null)
    {
   	 	this.owner = Owner;
    	this.dead = false;
    	this.used = false;
    }

   	switch(Type)
   	{
	   	case "Peasant":
		   	this.dmg = 1;
		   	this.hp = 2;
		   	this.movePlus = 1;
		   	this.moveX = 1;
		   	this.attackPlus = 1;
		   	this.attackX = 1;
		   	this.buff =  0;
	   		break;
	   	case "Scout":
		   	this.dmg = 1;
		   	this.hp = 1;
		   	this.movePlus = 3;
		   	this.moveX = 0;
		   	this.attackPlus = 0;
		   	this.attackX = 2;
		   	this.buff = 0;
		   	this.isRanged = true;
		   	break;
	   	case "Ranger":
		   	this.dmg = 1;
		   	this.hp = 1;
		   	this.movePlus = 0;
		   	this.moveX = 2;
		   	this.attackPlus = 3;
		   	this.attackX = 3;
		   	this.buff = 0;
		   	this.isRanged = true;
		   	break;
	   	case "King":
		   	this.dmg = 3;
		   	this.hp = 2;
		   	this.movePlus = 1;
		   	this.moveX = 1;
		   	this.attackPlus = 1;
		   	this.attackX = 1;
		   	this.buff = 0;
	   		break;
	   	case "Rez":
	   		this.buff = 1;
	   		break;
	   	case "Damage":
	   		this.buff = 1;
	   		break;
	   	case "Speed":
	  	 	this.buff = 1;
	   		break;
	   	case "Health":
	  	 	this.buff = 1;
	  	 	break;
	   	default:
	 	  	break;
    }

	this.Copy_Stats = function(Unit)
	{
		this.dmg = Unit.dmg;
		this.hp = Unit.hp;
		this.movePlus = Unit.movePlus;
		this.moveX = Unit.moveX;
		this.attackPlus = Unit.attackPlus;
		this.attackX = Unit.attackX;
		this.dead = Unit.dead;
		this.buff = Unit.buff;
		this.owner = Unit.owner;
		this.type = Unit.type;
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
	}

	this.Take_Damage = function(damage)
	{
		this.hp = this.hp - damage;
		
		if (this.hp == 0)
		{
			this.dead = true;
		}
	};


	this.Apply_Buff = function(buff)
	{
		switch(buff.type)
		{
			case "Rez":
				// Click Event on Graveyard
				// place unit on row 7 , checking columns 5,4,6,3,7,2,8
				// to place the unit down
				// generate new Unit with data baed on dead_unit clicked data
				// dead_unit.pop() that clicked on unit.
				break;

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