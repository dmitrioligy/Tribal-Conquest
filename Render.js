
function Render(game, socket) 
{
    // Moving parts of drawBoard (that don't have to be executed everytime) outside
    var board = game.table;
    var width, height, radius, OX, OY;
    var images = {};
    images["King"] = 'http://25.media.tumblr.com/2afd2f3d6761fd8afc59f8b7c72f7f53/tumblr_mo50xwuvIn1s8a280o1_1280.png';
    images["Peasant"] = 'http://www.pd4pic.com/images800_/cowboy-farm-farmer-smiley-trident-dung-fork.png';
    images["Ranger"] = 'http://clipartist.info/openclipart.org/SVG/paxed/bow_and_arrow_2-800px.png';
    images["Scout"] = 'http://www.downloadclipart.net/large/159-left-foot-print-design.png';

    function makePizza(i) 
    {
        return function (context) {
            context.beginPath();
            context.moveTo(OX, OY);
            context.lineTo(OX + 2 * radius * Math.cos(i * Math.PI / 4), OY + 2 * radius * Math.sin(i * Math.PI / 4));
            context.arc(OX, OY, 2 * radius, i * Math.PI / 4, (i + 1) * Math.PI / 4);
            context.closePath();
            context.fillStrokeShape(this);
        };
    }

    function makeCell(i, j) 
    {
        return function (context) {
            var r1 = (i + 1) * radius,
                r2 = (i + 2) * radius; // Inner and Outer radius of the cell segment
            context.beginPath();
            context.moveTo(OX + r1 * Math.cos((j + 1) * Math.PI / 12), OY + r1 * Math.sin((j + 1) * Math.PI / 12));
            context.arc(OX, OY, r1, (j + 1) * Math.PI / 12, j * Math.PI / 12, true);
            context.lineTo(OX + r2 * Math.cos(j * Math.PI / 12), OY + r2 * Math.sin(j * Math.PI / 12));
            context.arc(OX, OY, r2, j * Math.PI / 12, (j + 1) * Math.PI / 12);
            context.closePath();
            context.fillStrokeShape(this);
        };
    }

    // Simulating the client's clicking on a unit and either attacking or moving it
    this.synchronizeTurn = function(oldX, oldY, newX, newY)
    {
        // Avoiding duplicate moves
        if(game.Current_Player == game.table[oldX][oldY].owner)
            return;

        // Deselecting the previously selected cell
        if(game.lastClicked)
            board[game.lastClicked[0]][game.lastClicked[1]].visual.fire("click");

        game.table[oldX][oldY].visual.fire('click');
        game.table[newX][newY].visual.fire('click');
    }

    function drawBoard() 
    {
        width = window.innerWidth || document.body.clientWidth;
        height = window.innerHeight || document.body.clientHeight;
        radius = Math.min(width, height) / 20;
        OX = width / 2;
        OY = height / 2;
        var imagesLoaded = 0,
            totalImages  = 0;

        var stage = new Kinetic.Stage({
            container: 'container',
            width: width,
            height: height
        });

        function resizeThings() 
        {
            var width2 = window.innerWidth || document.body.clientWidth;
            var height2 = window.innerHeight || document.body.clientHeight;
            var widthScale = width2 / width;
            var heightScale = height2 / height;
            var scale = Math.min(widthScale, heightScale);
            stage.setWidth(width2);
            stage.setHeight(height2);
            stage.setScale({
                x: scale,
                y: scale
            });
            stage.draw();
        }
        window.onresize = resizeThings;

        var layer = new Kinetic.Layer();

        // function drawTooltip()
        // {
        //     var complexText = new Kinetic.Text({
        //         x: 100,
        //         y: 60,
        //         text: 'COMPLEX TEXT\n\nAll the world\'s a stage, and all the men and women merely players. They have their exits and their entrances.',
        //         fontSize: 18,
        //         fontFamily: 'Calibri',
        //         fill: '#555',
        //         width: 380,
        //         padding: 20,
        //         align: 'center'
        //       });

        //       var rect = new Kinetic.Rect({
        //         x: 100,
        //         y: 60,
        //         stroke: '#555',
        //         strokeWidth: 5,
        //         fill: '#ddd',
        //         width: 380,
        //         height: complexText.height(),
        //         shadowColor: 'black',
        //         shadowBlur: 10,
        //         shadowOffset: {x:10,y:10},
        //         shadowOpacity: 0.2,
        //         cornerRadius: 10
        //       });
        // }

        moveUnit = function(object, unitX, unitY)
        {
            var i = object.getAttr('myX'), j = object.getAttr('myY');

            // Deselect unit
            board[unitX][unitY].visual.fire('click');

            // Move unit to the clicked cell (in the database) and remove it from the previous
            var temp = board[i][j].visual;
            var temp2 = board[unitX][unitY].visual;
            board[i][j] = board[unitX][unitY];
            board[i][j].visual = temp;

            board[unitX][unitY] = new Unit(null, null);
            board[unitX][unitY].visual = temp2;
            board[unitX][unitY].visual.off('click');

            // Actually move the unit graphically
            var data = calcImageData(i, j);
            board[i][j].image.setPosition({x: data.x, y: data.y});
            board[i][j].image.setSize({width: data.w, height: data.h});
            board[i][j].image.setOffset({x: data.w/2, y: data.h/2});
            board[i][j].visual.on('click', clickOnUnit);
            stage.draw();
            socket.emit('play_a_unit', { oldX: unitX, oldY: unitY, newX: i, newY: j });
        }

        attackUnit = function(object, unitX, unitY)
        {
            var i = object.getAttr('myX'), j = object.getAttr('myY');

            // Deselect unit
            board[unitX][unitY].visual.fire('click');

            // Inflict damage
            board[i][j].hp -= board[unitX][unitY].dmg;

            // What to do if the unit dies:
            var isDead = board[i][j].hp == 0;
            if(isDead)
            {
                // Move the attacked unit to the graveyard
                var graveIndex = game.dead_container.length;
                game.dead_container[graveIndex] = board[i][j];
                var graveyardScale = calcImageData(7, 0);
                board[i][j].image.setSize({width: graveyardScale.w, height: graveyardScale.h});
                board[i][j].image.setPosition({x: radius + graveIndex*2*radius, y: radius}); //TODO calculate numbers
                board[i][j].visual.off('click');

                if(!board[unitX][unitY].isRanged) // If the unit is melee
                {
                    // Move the attacker to the clicked cell (in the database) overwriting the dead unit
                    var temp = board[i][j].visual;
                    var temp2 = board[unitX][unitY].visual;
                    board[i][j] = board[unitX][unitY];
                    board[i][j].visual = temp;

                    // Remove the attacker from its original position
                    board[unitX][unitY] = new Unit(null, null);
                    board[unitX][unitY].visual = temp2;
                    board[unitX][unitY].visual.off('click');

                    // Actually move the unit graphically
                    var data = calcImageData(i, j);
                    board[i][j].image.setPosition({x: data.x, y: data.y});
                    board[i][j].image.setSize({width: data.w, height: data.h});
                    board[i][j].image.setOffset({x: data.w/2, y: data.h/2});
                    board[i][j].visual.off('click');
                    board[i][j].visual.on('click', clickOnUnit);
                }
                else
                {
                    // Remove the dead unit from its cell
                    var temp = board[i][j].visual;
                    board[i][j] = new Unit(null, null);
                    board[i][j].visual = temp;
                    board[i][j].visual.off('click');
                }
            }
            stage.draw();  
            socket.emit('play_a_unit', {oldX: unitX, oldY: unitY, newX: i, newY: j});
        }

        clickOnUnit = function()
        {
            var i = this.getAttr('myX'), j = this.getAttr('myY');

            // Deselecting the previously selected cell
            if(game.lastClicked)
                board[game.lastClicked[0]][game.lastClicked[1]].visual.fire("click");

            // Highlighting the cell and adding the proper event handler to it
            board[i][j].visual.fill("#3399FF");
            board[i][j].visual.off('click');
            board[i][j].visual.on("click", clickOnHighlightedUnit);

            //Highlighting the cells which the unit can move to and attaching proper event handlers to them
            var canMove = game.Move_Range(i,j);
            for(var t = 0; t < canMove.length; ++t)
            {
                var x = canMove[t][0], y = canMove[t][1];
                board[x][y].visual.fill("#66FF66");
                board[x][y].visual.off('click');
                board[x][y].visual.on("click", function() {
                    moveUnit(this, i, j);
                });
            }

            //Highlighting the cells which the unit can attack and attaching proper event handlers to them
            var attackData = game.Attack_Range(i,j);
            var canAttack = attackData[0];
            var attackRange = attackData[1];

            // Highlighting the cells the unit can attack right now
            for(var t = 0; t < canAttack.length; ++t)
            {
                var x = canAttack[t][0], y = canAttack[t][1];
                board[x][y].visual.fill("#D65E5E");
                board[x][y].visual.off('click');
                board[x][y].visual.on('click', function() {
                    attackUnit(this, i, j);
                });
            }
          
            // Highlighting the cells which the unit could attack if there was an enemy inside
            for(var t = 0; t < attackRange.length; ++t)
            {
                var x = attackRange[t][0], y = attackRange[t][1];
                if(board[x][y].visual.fill() == '#66FF66' || board[x][y].visual.fill() == '')
                {
                    var r, gx, gy;
                    if(x == 0)
                    {
                        r = 1.35 * radius;
                        gx = OX + r * Math.cos(y * Math.PI/4 + Math.PI/8);
                        gy = OY + r * Math.sin(y * Math.PI/4 + Math.PI/8);
                    }
                    else
                    {
                        r = (x + 1.5) * radius;
                        gx = OX + r * Math.cos(y * Math.PI/12 + Math.PI/24);
                        gy = OY + r * Math.sin(y * Math.PI/12 + Math.PI/24);
                    }
                    board[x][y].visual.fill('');
                    board[x][y].visual.setAttrs({
                        fillRadialGradientStartPoint: {x:gx,y:gy},
                        fillRadialGradientStartRadius: 0,
                        fillRadialGradientEndPoint: {x:gx,y:gy},
                        fillRadialGradientEndRadius: radius/2,
                        fillRadialGradientColorStops: [0, '#ED8282', 1, '#66FF66'],
                    });
                }
                else board[x][y].visual.fill("#F0CCCC");
            }

            game.lastClicked = [i, j];
            stage.draw();
        }

        clickOnHighlightedUnit = function()
        {
            var i = this.getAttr('myX'), j = this.getAttr('myY');

            // Deselecting the unit and reverting its event handler
            board[i][j].visual.fill((i + j) % 2 ? '#C4C4C4' : '#FFFFFF');
            board[i][j].visual.off('click');
            board[i][j].visual.on("click", clickOnUnit);

            // Deselecting the green cells and reverting their event handlers
            var canMove = game.Move_Range(i,j);
            for(var t = 0; t < canMove.length; ++t)
            {
                var x = canMove[t][0], y = canMove[t][1];
                board[x][y].visual.fill((x + y) % 2 ? '#C4C4C4' : '#FFFFFF');
                board[x][y].visual.off('click');
            }

            // Deselecting the red cells and reverting their event handlers
            var attackData = game.Attack_Range(i,j);
            var canAttack = attackData[0];
            var attackRange = attackData[1];

            for(var t = 0; t < canAttack.length; ++t)
            {
                var x = canAttack[t][0], y = canAttack[t][1];
                board[x][y].visual.fill((x + y) % 2 ? '#C4C4C4' : '#FFFFFF');
                board[x][y].visual.off('click');
                if(board[x][y].type)
                    board[x][y].visual.on('click', clickOnUnit);
            }

            for(var t = 0; t < attackRange.length; ++t)
            {
                var x = attackRange[t][0], y = attackRange[t][1];
                board[x][y].visual.fill((x + y) % 2 ? '#C4C4C4' : '#FFFFFF');
            }

            game.lastClicked = null;
            stage.draw();
        }

        function calcImageData(i, j)
        {
            if(i == 0)
            {
                var scale = 0.8;
                var w = radius * scale, h = w;
                return {
                    x: OX + 1.35 * radius * Math.cos(j * Math.PI / 4 + Math.PI / 8),
                    y: OY + 1.35 * radius * Math.sin(j * Math.PI / 4 + Math.PI / 8),
                    w: w, 
                    h: h
                }
            }
            else
            {
                var imageObj = new Image();
                var scale = (i - 7)/13 + 1;
                var w = radius * scale, h = w;
                return {
                    x: OX + (i + 1.5) * radius * Math.cos(j * Math.PI / 12 + Math.PI / 24),
                    y: OY + (i + 1.5) * radius * Math.sin(j * Math.PI / 12 + Math.PI / 24),
                    w: w, 
                    h: h
                }
            }
        }

        function fillPizza(i, src) 
        {
            var imageObj = new Image();
            imageObj.src = src;
            var data = calcImageData(0, i);
            imageObj.onload = function () {
                var unit = new Kinetic.Image({
                    x: data.x,
                    y: data.y,
                    offset: {
                        x: data.w/2,
                        y: data.h/2
                    },
                    image: imageObj,
                    width: data.w,
                    height: data.h,
                });
                board[0][i].visual.on("click", clickOnUnit);
                board[0][i].image = unit;
                unit.setListening(false);
                layer.add(unit);
                imagesLoaded++;

                // The loading order of the images is not guaranteed, so we have to count the number of images loaded
                if(imagesLoaded == totalImages)
                    stage.add(layer);   
            };
        }

        function fillRegular(i, j, src)
        {
            var imageObj = new Image();
            imageObj.src = src;
            var data = calcImageData(i, j);
            imageObj.onload = function () {
                var unit = new Kinetic.Image({
                    x: data.x,
                    y: data.y,
                    offset: {
                        x: data.w/2,
                        y: data.h/2
                    },
                    image: imageObj,
                    width: data.w,
                    height: data.h,
                });
                board[i][j].visual.on("click", clickOnUnit);
                board[i][j].image = unit;
                unit.setListening(false);
                layer.add(unit);
                imagesLoaded++;

                // The loading order of the images is not guaranteed, so we have to count the number of images loaded
                if(imagesLoaded == totalImages)
                    stage.add(layer);
            };
        }

        for (i = 0; i < 8; i++) {
            board[0][i].visual = new Kinetic.Shape({
                sceneFunc: makePizza(i),
                fill: i % 2 ? '#C4C4C4' : '#FFFFFF',
                stroke: 'black',
                strokeWidth: 1,
                myX: 0,
                myY: i,
            });
            if(board[0][i].type != undefined)
            {
                totalImages++;
                fillPizza(i, images[board[0][i].type]);
            }
        }

        for (i = 1; i < 8; i++)
            for (j = 0; j < 24; j++)
            {
                board[i][j].visual = new Kinetic.Shape({
                    sceneFunc: makeCell(i, j),
                    fill: (i + j) % 2 ? '#C4C4C4' : '#FFFFFF',
                    stroke: 'black',
                    strokeWidth: 1,
                    myX: i,
                    myY: j,
                });
                if(board[i][j].type != undefined)
                {
                    totalImages++;
                    fillRegular(i, j, images[board[i][j].type]);
                }
            }

        for (i = 0; i < 8; i++)
        {
           layer.add(board[0][i].visual);
        }
        for (i = 1; i < 8; i++)
            for (j = 0; j < 24; j++)
            {
                layer.add(board[i][j].visual);
            }
    }
    drawBoard();
}