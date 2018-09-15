//When the window is loaded
window.addEventListener('load', init);

function init(){

    //Get the canvas
    var canvas = document.getElementById("theCanvas");
    
    //Allow to draw in canvas in 2D
    var ctx = canvas.getContext("2d");

    canvas.width = 1200;
    canvas.height = 600;

    var fixTimeRound = 8;
    
    var game = {
        status: 'Starting',
        round: 0,
        allowEnemies: 0,
        timeRound: fixTimeRound,
        totalRounds: 1
    
    }
    
    //CREATES THE OBJECT SHIP
    var ship = {
        x: 100,
        y: canvas.height - 75,
        width: 30,
        height: 47,
        counter: 0,
        status: 'Alive',
        bullets: 18,
        grumsKilled: 0
    }
    
    //OBJECT TO KEEP THE KEYS TO BE PRESSED
    var keys = {}
    
    //CREATES ARRAY FOR ALL SHOOTS AND A BOOL TO ALLOW ONE SHOT PER PRESS
    var shoots = [];
    var keyBoolShoot = false;
    
    //ARRAY WITH ENEMIES 
    var enemies = [];
    var enemiesShoots = [];
    var specialBullets = [];
    
    //VAR TO KEEP THE BACKGROUND
    var background;
    
    var textResponse = {
        counter: -1,
        title: '',
        subtitle: ''
    }
    
    //AUDIOS NEED TO BE DECLARED ONLY ONCE HERE
    var simpleShoot = new Audio("Audios/simpleShoot.wav");
    var gameOver = new Audio("Audios/gameOver.wav");
    var winSound = new Audio("Audios/win.mp3");
    winSound.volume = 0.1;
    var enemySound = new Audio("Audios/enemy.mp3");
    simpleShoot.volume = 0.1;
    
    var lifeSound = new Audio("Audios/life.wav");
    
    
    
    

    
    var intervalRound = setInterval(roundFunc, 1000);
    
    function roundFunc(){
        
        if(game.round < 6){
        
            if(game.timeRound > 0){
                game.timeRound--;

            }else{
                game.timeRound = fixTimeRound;
                ship.bullets += 18;
                game.round++;
                game.allowEnemies = 1;
                game.totalRounds += 1;
            }
            
        }else{
            game.round = 0;
        }
        
    }
    
    
    
    /*****************************************
        ALL FUNCTIONS DECLARED UNDERNEATH
    ****************************************/
    
    //FUNCTION TO BE CALLED WHEN ALL HAS BEEN LOADED    
    function loadMedia(){
        
        //IMAGES
        background = new Image(); 
        background.src = "bg.jpg";
        
        spaceShip = new Image();
        spaceShip.src = "ship.png";
        
        spaceShipDead = new Image();
        spaceShipDead.src = "ship_dead.png";
        
        enemyImg = new Image();
        enemyImg.src = "enemy.png";
        
        bulletImg = new Image();
        bulletImg.src = "bullet.png"
        
        
        //When the background has been loaded, the frameLoop is going to called every x time
        background.onload = function(){ 
            var interval = window.setInterval(frameLoop, 1000/55);
            
        }
    }
    
    
    
    /*****************************************
                DRAW FUNCTIONS
    ****************************************/
    
    //DRAW BACKGROUND
    function drawBackground(){
        ctx.drawImage(background,0,0);
    }
    
    //DRAW ENEMIES
    function drawEnemies(){
        for(var i in enemies){
            
            //If the enemy is alive, draw it
            if(enemies[i].status == 1){
                
                ctx.drawImage(enemyImg, enemies[i].x, enemies[i].y);
                
            }
            
        }
    }
    
    //DRAW THE ENEMIES BULLETS
    function drawEnemiesShoots(){    
        ctx.save();
        ctx.fillStyle = 'yellow'; 
        for(var i in enemiesShoots){ 
            ctx.fillRect(enemiesShoots[i].x, enemiesShoots[i].y, enemiesShoots[i].width, enemiesShoots[i].height);      
        }
        ctx.restore();
    }
    
    //DRAW THE SPACE SHIP
    function drawSpaceShip(){
        
        if(ship.status == 'Dead' || ship.status == 'Hit'){
            ctx.drawImage(spaceShipDead, ship.x, ship.y);
        }else{
            ctx.drawImage(spaceShip, ship.x, ship.y);
        }
        
        
    }
    
    //DRAW BULLETS
    function drawShoots(){
        ctx.save();
        ctx.fillStyle = 'white';
        for(var i in shoots){
            ctx.fillRect(shoots[i].x, shoots[i].y, shoots[i].width, shoots[i].height);
        }
        ctx.restore();
    }
    
    //DRAW SPECIAL BULLETS
    function drawSpecial(){
        
        ctx.save();
        ctx.fillStyle = 'Red';


        for(var i in specialBullets){
            ctx.drawImage(bulletImg,specialBullets[i].x,specialBullets[i].y);
        }

        ctx.restore();
        
    }
    
    //DRAW TEXT 
    function drawText(){
        
        //DRAWING ENEMIS NUMBER
        ctx.save();
        ctx.fillStyle = "White";
        ctx.font = "Bold 10pt Arial";
        ctx.fillText("Grums: " + enemies.length, 10, 20);
        ctx.fillText("Missils: " + ship.bullets, 10, 40);
        
        ctx.fillText("Kills: " + ship.grumsKilled, canvas.width - 70, canvas.height - 10);
        ctx.fillText("Rounds: " + game.totalRounds, canvas.width - 160, canvas.height - 10);
        
        ctx.font = "Bold 50pt Arial";
        ctx.fillText(game.timeRound, canvas.width - 40, 53);
        ctx.restore();
        
        
        //IF the counter hasn't changed, leave the functions
        if(textResponse.counter == -1){
            return false;
        }
        
        //FOR THE EFFECTS
        if(textResponse.counter >= 0){
            textResponse.counter++;
            
        }
        
        //ALPHA IS GOING TO KEEP THE SPEED FROM 0 TO 1 TO APPLY IN globalAlpha UNDERNEATH
        var alpha = textResponse.counter/50.0;
        
        //DELETE ELEMENTS SO IT CAN NOT BE PLAYED AGAIN
        if(alpha > 0){
            for(var i in enemies){
                delete enemies[i];
            }
        }
        
        //ACTUAL DRAWING TEXT
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.globalAlpha = alpha; //Alpha changes shown on top
        
        ctx.font = 'Bold 40pt Arial';
        ctx.fillText(textResponse.title,140,200);
        ctx.font = '14pt Arial';
        ctx.fillText(textResponse.subtitle,190,250);        
        ctx.restore();
        
    }
    
    
    
    /*****************************************
                KEYS FUNCTIONS
    ****************************************/
    
    //PRESSED KEYS
    function pressedKeys(){
        
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
        
    }
    
    //SEND OUR BULLETS
    function fire(){
        
        if(ship.bullets > 0){
        
            shoots.push({
                x: ship.x + (ship.width / 2) - 2.5,
                y: ship.y - 10,
                width: 5,
                height: 10,
                status: 1
            });
            
            ship.bullets--;
            simpleShoot.play(); //Sound of shooting
            
        
        }
    }
    
    
    
    /*****************************************
                AUTO FUNCTIONS
    ****************************************/
        
    //MOVE OUR SHOOTS
    function moveShoots(){
        
        //Actual movement
        for(var i in shoots){
            var shoot = shoots[i];
            shoots[i].y -= 10;
        }
        
        shoots = shoots.filter(function(shoot){
            return shoot.y > 0;
        });
        
    }
    
    //CREATES ENEMIES, MOVE THEM AND ADD SHOOTS
    function updateEnemies(){
        
        //PUSH AND ENEMY - CHECK BELOW TO KNOW IT PUSHES A BULLET NOT SO OFTEN
        function addEnemyShoot(enemy){
            return {
                x: enemy.x + (enemy.width / 2) + 2.5,
                y: enemy.y + enemy.height,
                width: 5,
                height: 10,
                status: 1,
                counter: 0
            }
        }
        
        //WHEN THE GAMES STARTS, CREATES THE ENEMIES
        if(game.status == 'Starting' || game.allowEnemies == 1){
            for(var i = 0; i < 10; i++){
                enemies.push({
                    x: 10 + (i * 50), 
                    y: 10 + game.round * 50,
                    width: 55,
                    height: 40,
                    status: 1,
                    speed: (Math.random() * 7) + 2,
                    counter: 0
                });  
            }
            game.allowEnemies = 0;
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
                if(enemies[i].x < -50){
                    enemies[i].speed = enemies[i].speed * -1;
                }
                
                //Make the actual movement
                enemies[i].x += enemies[i].speed;
                
                //Call the random function, if returns 4 then push a bullet the enemiesShoots
                if(random(0,enemies.length * 6) == 4){
                    enemiesShoots.push(addEnemyShoot(enemies[i]));
                }
                
                
                if(random(0, 30000 / enemies.length ) == 1){
                    specialBullets.push(addSpecialShoot(enemies[i]));
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
    
    //MOVE THE ENEMIES BULLETS
    function moveEnemiesShoots(){
        
        for(var i in enemiesShoots){
            var singleShoot = enemiesShoots[i];
            //Increase variable to make movement
            enemiesShoots[i].y += 3;
        }
        
        enemiesShoots = enemiesShoots.filter(function(singleShoot){
            return singleShoot.y < canvas.height;
        });
    }
    
    //ADD SPECIAL SHOOT TO ARRAY
    function addSpecialShoot(enemy){
        
        return {
            x: enemy.x + (enemy.width / 2) - 10,
            y: enemy.y + enemy.height,
            width: 25,
            height: 25,
            status: 1
        }
        
    }
    
    //MOVE SPECIAL SHOOT
    function moveSpecialShoot(){
        
        for(var i in specialBullets){
            specialBullets[i].y += 3; 
        }
        
        specialBullets = specialBullets.filter(function(abc){
            return abc.y < canvas.height
        });
        
    }

    
    
    /*****************************************
              RECURSIVE FUNCTIONS
    ****************************************/
    
    //CHECK ALL COLLISIONS 
    function checkCollision(){
        
        //Send the every shoot and every enemy to the collision algorithm and make the status 0 if touched
        for(var i in shoots){
            for(var j in enemies){
                if(collision(shoots[i],enemies[j]) && shoots[i].status == 1){
                    enemySound.play();
                    enemies[j].status = 0;
                    shoots[i].status = 0;
                    ship.grumsKilled += 1;
                                
                }
            }
       }   
        
        shoots = shoots.filter(function(a){
            return a.status != 0;
        });
   
        
        
        for(var i in specialBullets){
            if(collision(specialBullets[i],ship) && game.status == "Playing" && specialBullets[i].status == 1){
                specialBullets[i].status = 0;
                ship.bullets += 3;   
                lifeSound.play();
                
            }
        }
        
        specialBullets = specialBullets.filter(function(a){
            return a.status != 0;
        });
        
        //IF THE SHIP IS ALIVE THEN WAIT FOR THE COLLISION
        if(ship.status == 'Alive'){
           
            //Check all bullets and wait for collision
            for(var i in enemiesShoots){
                if(collision(enemiesShoots[i],ship) && game.status == "Playing"){
                    ship.status = 'Hit';
                    ship.bullets = 0;
                    enemiesShoots[i].status = 0;
                    gameOver.play(); //Play sound 
                }
            }
            
            enemiesShoots = enemiesShoots.filter(function(a){
                return a.status != 0
            });
            
         }
        
        
        
    }
    
    //UPDATE STATUS
    function updateStatusGame(){
      
        //IF THE USER WINS
        if(game.status == 'Playing' && enemies.length == 0){
            game.status = 'Win';
            textResponse.title = 'You win';
            textResponse.subtitle = 'Press R to restart';
            textResponse.counter = 0;
            winSound.play();
            clearInterval(intervalRound);
        }
        
        //IF THE STATUS OF SHIP IS HIT (ONLY ONCE)
        if(ship.status == 'Hit'){
            
            //The ship.counter delays a bit to achieve a better effect
            ship.counter++;
            
            if(ship.counter >= 20){
                ship.counter = 0;
                clearInterval(intervalRound);
                ship.status = 'Dead';
                game.status = 'Lost';
                textResponse.title = 'Game Over';
                textResponse.subtitle = 'Press R to continue';
                
                //For effect using ALPHA (Go top) in the TEXT
                textResponse.counter = 0;
            }
        }
        
        //RESTART THE GAME PRESSING R
        if((game.status == 'Lost' || game.status == 'Win') && keys[82]){
            
            game.status = 'Starting';
            ship.bullets = 18;
            ship.x = 100;
            intervalRound = setInterval(roundFunc, 1000);
            ship.status = 'Alive';
            textResponse.counter = -1;
            
            ship.grumsKilled = 0;
            game.timeRound = fixTimeRound;
            game.allowEnemies = 0;
            game.round = 0;
            game.totalRounds = 1;
        }
        
    }
    
    
    
    /*****************************************
                HELPER FUNCTIONS
    ****************************************/
    
    //RANDOM RETURNS AN INTEGER
    function random(low,high){
        var positibilites = high - low;
        var a = Math.random() * positibilites;
        
        a = Math.floor(a);
        return parseInt(low) + a;
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
        moveSpecialShoot();
        
        moveShoots();
        checkCollision();
        
        //Functions from the user
        pressedKeys();
        
        //Drawing items
        drawBackground();
        drawEnemies();
        drawEnemiesShoots();
        drawSpaceShip();
        drawShoots();
        drawSpecial();
        drawText();
        
    }
    
    //LOAD TO START
    loadMedia();
    addEventKeys();
    
    


   

}