//When the window is loaded
window.addEventListener('load', init);

function init(){

    //Get the canvas
    var canvas = document.getElementById("theCanvas");
    
    //Allow to draw in canvas in 2D
    var ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 500;

    var game = {
        status: 'Starting'
    }
    
    //CREATES THE OBJECT SHIP
    var ship = {
        x: 100,
        y: canvas.height - 100,
        width: 50,
        height: 50,
        counter: 0
    }
    
    //OBJECT TO KEEP THE KEYS TO BE PRESSED
    var keys = {}
    
    //CREATES ARRAY FOR ALL SHOOTS AND A BOOL TO ALLOW ONE SHOT PER PRESS
    var shoots = [];
    var keyBoolShoot = false;
    
    //ARRAY WITH ENEMIES 
    var enemies = [];
    var enemiesShoots = [];
    
    //VAR TO KEEP THE BACKGROUND
    var background;
    
    var textResponse = {
        counter: -1,
        title: '',
        subtitle: ''
    }
    
    
    
    /*****************************************
        ALL FUNCTIONS DECLARED UNDERNEATH
    ****************************************/
    
    //FUNCTION TO BE CALLED WHEN ALL HAS BEEN LOADED    
    function loadMedia(){
        background = new Image(); 
        background.src = "space.png";
        //When the background has been loaded, the frameLoop is going to called every x time
        background.onload = function(){ 
             var interval = window.setInterval(frameLoop, 1000/55);
        }
    }
    
    //DRAW ENEMIES
    function drawEnemies(){
        for(var i in enemies){
            
            //If the enemy is alive, draw it
            if(enemies[i].status == 1){
            
                ctx.save(); //Save the context properties
                ctx.fillStyle = 'red';
                ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
                ctx.restore();
            }
            
        }
    }
    
    //DRAW BACKGROUND
    function drawBackground(){
        ctx.drawImage(background,0,0);
    }
    
    //DRAW THE SHIP
    function drawSpaceShip(){
        ctx.save(); //Save the context properties
        ctx.fillStyle = "white";
        ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
        ctx.restore();
    }
    
    //MOVEMENT OF SHIP
    function moveShip(){
        
        //IF THE KEY 65 IS TRUE (PRESSED) LEFT
        if(keys[65]){
            ship.x -= 5;
            //Find the limit of movement
            if(ship.x < 10){
                ship.x = 10;
            }
        }
        
        //IF THE KEY 68 IS TRUE (PRESSED) RIGHT
        if(keys[68]){
            ship.x += 5;
            //Find the limit of movement
            var limit =  canvas.width - ship.width - 10;
            if(ship.x > limit){
                ship.x = limit;
            }
        }
        
        //IF THE KEY 38 IS TRUE (PRESSED) SHOOT
        if(keys[38]){
            //The boolean must be FALSE 
            if(!keyBoolShoot){
                fire();
                keyBoolShoot = true; //Make the boolean true, so it doesn't allow to use this IF again for the FIRE()
            }
            
        //THE KEY MUST BE FALSE WHICH MEANS A RELEASE (keyup)    
        }else{
            keyBoolShoot = false; //The boolean becomes false, so it can be used again in the previous IF statement
        }
        
        if(ship.status == 'Hit'){
            
            ship.counter++
            if(ship.counter >= 20){
                ship.counter = 0;
                ship.status = 'Dead';
                game.status = 'Lost';
                textResponse.title = 'Game Over';
                textResponse.subtitle = 'Press R to continue';
                textResponse.counter = 0;
                console.log("hey");
            }
        }
        
    }
    
    //DRAW THE ENEMIES BULLETS
    function drawEnemiesShoots(){
        
        for(var i in enemiesShoots){    
            ctx.save();
            ctx.fillStyle = 'yellow'; ctx.fillRect(enemiesShoots[i].x,enemiesShoots[i].y,enemiesShoots[i].width,enemiesShoots[i].height);
            ctx.restore();
        }
        
    }
    
    //MOVE THE ENEMIES BULLETS
    function moveEnemiesShoots(){
        
        for(var i in enemiesShoots){
            var singleShoot = enemiesShoots[i];
            //Increase variable to make movement
            enemiesShoots[i].y += 3;
        }
        
        /* FILTER CREATES AN ARRAY IN WHICH CHECKS A CONDITION IN THE RETURN OF THE FUNCTION TO REMOVE
           THE ELEMENT IF MEETS THE CONDITION */
        enemiesShoots = enemiesShoots.filter(function(singleShoot){
            return singleShoot.y < canvas.height;
        });
    }
    
    //CREATES ENEMIES, MOVE THEM AND ADD SHOOTS
    function updateEnemies(){
        
        //PUSH AND ENEMY - CHECK BELOW TO KNOW IT PUSHES A BULLET NOT SO OFTEN
        function addEnemyShoot(enemy){
            return {
                x: enemy.x,
                y: enemy.y,
                width: 5,
                height: 10,
                counter: 0
            }
        }
        
        //WHEN THE GAMES STARTS, CREATES THE ENEMIES
        if(game.status == 'Starting'){
            for(var i = 0; i < 10; i++){
                enemies.push({
                    x: 10 + (i * 50), 
                    y: 10,
                    width: 40,
                    height: 40,
                    status: 1,
                    speed: (Math.random() * 7) + 2,
                    counter: 0
                });  
            }
            game.status = 'Playing';
        }
        
        
        //MOVEMENT OF THE ENEMIES
        for(var i in enemies){
            //If the enemy is false, jump to next iteration
            if(!enemies[i]){
                continue;
            }
            
            //If the enemy is true and it is alive
            if(enemies[i] && enemies[i].status == 1){
                enemies[i].counter++;
                
                //Limit to the right
                if(enemies[i].x > canvas.width + 50){
                    enemies[i].speed = -enemies[i].speed;
                }
                
                //Limit to the left
                if(enemies[i].x <  -50){
                    enemies[i].speed = enemies[i].speed * -1;
                }
                
                //Make the actual movement
                enemies[i].x += enemies[i].speed;
                
                
                
                //Call the random function, if returns 4 then push a bullet the enemiesShoots
                if(random(0,enemies.length * 10) == 4){
                    enemiesShoots.push(addEnemyShoot(enemies[i]));
                }
                
            }
        }
        
        //THIS IS GOING TO REMOVE THE ENEMIES FROM THE ARRAY
        enemies = enemies.filter(function(e){
            if(e && e.status != 0){ //If the enemy is ALIVE
                return true;
            }else{
                return false;
            }
        });
        
        

        
                
    }
    
    //RANDOM RETURNS AN INTEGER
    function random(low,high){
        var positibilites = high - low;
        var a = Math.random() * positibilites;
        
        a = Math.floor(a);
        return parseInt(low) + a;
    }
    
    //MOVE OUR SHOOTS
    function moveShoots(){
        
        //Actual movement
        for(var i in shoots){
            var shoot = shoots[i];
            shoots[i].y -= 10;
        }
        
        /* FILTER CREATES AN ARRAY IN WHICH CHECKS A CONDITION IN THE RETURN OF THE FUNCTION TO REMOVE THE ELEMENT IF MEETS THE CONDITION */
        shoots = shoots.filter(function(shoot){
            return shoot.y > 0;
        });
        
    }
    
    //SEND OUR BULLETS
    function fire(){
        
        shoots.push({
            x: ship.x + (ship.width / 2),
            y: ship.y - 10,
            width: 5,
            height: 10
        });
        
    }
    
    //DRAW OUR BULLETS
    function drawShoots(){
        ctx.save();
        ctx.fillStyle = 'white';
        for(var i in shoots){
            ctx.fillRect(shoots[i].x, shoots[i].y, shoots[i].width, shoots[i].height);
        }
        ctx.restore();
    }
    

    
    
    function checkCollision(){
        for(var i in shoots){
            
            for(var j in enemies){
             
                if(collision(shoots[i],enemies[j])){
                    
                    enemies[j].status = 0;
            
                    
                }
                
            }
        }
        if(ship.status == 'Hit' || ship.status == 'Dead'){
            return;
        }
        for(var i in enemiesShoots){
            
            if(collision(enemiesShoots[i],ship)){
                ship.status = 'Hit';
               
            }
            
        }
        
    }
    
    function drawText(){
        
        if(textResponse.counter == -1){
            return false;
        }
        var alpha = textResponse.counter/50.0;
        
        if(alpha > 0){
            for(var i in enemies){
                delete enemies[i];
            }
        }
        ctx.save();
        ctx.globalAlpha = alpha;
        if(game.status == 'Lost'){
            ctx.fillStyle = 'white';
            ctx.font = 'Bold 40pt Arial';
            ctx.fillText(textResponse.title,140,200);

            ctx.font = '14pt Arial';
            ctx.fillText(textResponse.subtitle,190,250);
        }
        
     
        if(game.status == 'Win'){
            ctx.fillStyle = 'white';
            ctx.font = 'Bold 40pt Arial';
            ctx.fillText(textResponse.title,140,200);

            ctx.font = '14pt Arial';
            ctx.fillText(textResponse.subtitle,190,250);
        }
        ctx.restore();
        
    }
    
    
    function updateStatusGame(){
      
        if(game.status == 'Playing' && enemies.length == 0){
            game.status = 'Win';
            textResponse.title = 'You win';
            textResponse.subtitle = 'Press R to restart';
            textResponse.counter = 0;
        }
        
        if(textResponse.counter >= 0){
            textResponse.counter++;
            
        }
        
        if((game.status == 'Lost' || game.status == 'Win') && keys[82]){
            game.status = 'Starting';
            ship.status = 'Alive';
            textResponse.counter = -1;
        }
    }
    
    
    //KEYS LISTENER
    function addEventKeys(){
        
        //Add the pressed key to the array
        document.addEventListener("keydown",function(e){
            keys[e.keyCode] = true; //Associative key to a true value
          
        },false);

        //False the pressed key in the array when keyingup
        document.addEventListener("keyup",function(e){
             keys[e.keyCode] = false; //Associative key to a false value
            
        },false);
 
    }
    
    //ALGORITHM FOR COLLISION
    function collision(b, e){
        //B = BULLET, E = Enemy
        var hit = false;
        
        if(e.x + e.width >= b.x && e.x < b.x + b.width){
            if(e.y + e.height >= b.y && e.y < b.y + b.height){
                hit = true;   
            }
        }
        
        if(e.x <= b.x && e.x + e.width >= b.x + b.width){
            if(e.y <= b.y && e.y + e.height >= b.y + b.height){
               hit = true;
            }
        }
        
        if(b.x <= e.x && b.x + b.width >= e.x + e.width){
            if(b.y <= e.y && b.y + b.height >= e.y + e.height){
               hit = true;
            }
        }
        
        return hit;
    }
    
    //FUNCTION FOR EVERY FRAME 1000/55
    function frameLoop(){
        
        //Automatically functions
        updateStatusGame()
        updateEnemies();
        moveEnemiesShoots();
        moveShoots();
        checkCollision();
        
        //Functions from the user
        moveShip();
        
        //Drawing items
        drawBackground();
        drawEnemies();
        drawEnemiesShoots();
        drawSpaceShip();
        drawShoots();
        drawText();
        
    }
    
    //LOAD TO START
    loadMedia();
    addEventKeys();

}