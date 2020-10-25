var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var play;
displayWidth=windowWidth;
 displayHeight=windowHeight;
function preload(){
  pointer = loadImage("mouse.png")
  trex_running = loadAnimation("run00.png","run01.png","run02.png");
  trex_collided = loadAnimation("run02.png");
  
  groundImage = loadImage("forest.jfif");
  highestScore=0;
  localStorage=highestScore;
  
  cloudImage = loadImage("cloudd.png");
  
  obstacle1 = loadImage("cv.png");
  obstacle2 = loadImage("c2 (2).png");
  obstacle3 = loadImage("c3.png");
  obstacle4 = loadImage("c4.png");
  obstacle5 = loadImage("cv.png");
  obstacle6 = loadImage("c2 (2).png");
  restartImg = loadImage("restart.png");
  gameOverImg= loadImage("gameOver.png");
}

function setup() {
  createCanvas(displayWidth-970,displayHeight-600);
  play = createButton("Play")
  play.position(176,1140)
  play.size(200,200);
  play.style('border-radius','100px');
  play.style('font-size','50px');
  play.style('background','radial-gradient(yellow,orange,red)');
  play.style('border','5px solid black');
  jump = createButton("Jump");
  jump.position(225,1384)
  jump.size(100,45);
  jump.style('font-size','25px');
  jump.style('background','radial-gradient(yellow,orange,red)');
  jump.style('border','5px solid black')
  NOP=2
  PLAY=1;
  END=0;
  gameState=NOP;
  trex = createSprite(displayWidth-1450,displayHeight-620,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.3;
  m=createSprite(200,200,0,0);
  m.addImage(pointer);
  m.scale=0.05
  
 

  gameOver = createSprite(displayWidth-1200,displayHeight-770);
  gameOver.addImage(gameOverImg);
  restart = createSprite(displayWidth-1200,displayHeight-730);
 
  restart.addImage(restartImg)
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible=false;
  restart.visible = false;
  
  invisibleGround = createSprite(displayWidth/2,displayHeight-620,4000,10);
  invisibleGround.visible = false;

  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  bg=0;
  ground = createSprite(500,displayHeight-800,400,20);
  ground.addImage("ground",groundImage);
  ground1 = createSprite(300,displayHeight-800,400,20);
  ground1.addImage("ground",groundImage);
  ground.scale = 1.1;
  ground1.scale =1.1;
  
 
 
  

  
  
}

function draw() {
  
 
  background(0);
  stroke("black")
  strokeWeight(5)
  
  fill("white");
  textSize(30);

if(gameState==NOP){
  background(0)
    play.mousePressed(function h(){
      gameState=PLAY;
      play.hide();
    })
  }
  
 
  
  if(gameState==PLAY){
  
  ground.depth=ground1.depth;
  gameOver.depth=ground.depth-1;
  gameOver.depth=restart.depth;
  score = score + Math.round(getFrameRate()/60);
  ground.velocityX= -(6 + 2*score/100);
  ground1.velocityX= ground.velocityX
  if(keyDown("space") &&trex.y>180) {
    trex.velocityY = -17;
  }
 
  jump.mousePressed(function j(){
    if(trex.y>180&&gameState==PLAY){
    trex.velocityY = -17;
    }
  })

trex.velocityY = trex.velocityY + 1.1;
  
  if (ground.x <280){
    ground.x = 470;
  }
  if (ground1.x < 200){
    ground1.x = 300;
  }
  
  if(score>highestScore){
    highestScore=score
  }
  if(obstaclesGroup.isTouching(trex)){
    gameState = END;
}
}
else if (gameState === END) {
  play.show();
  gameOver.depth=ground.depth-1;
  gameOver.depth=ground1.depth-1;
  gameOver.depth=restart.depth;
  gameOver.visible = true;
  restart.visible = true;
  
  ground.velocityX = 0;
  ground1.velocityX = 0;
  trex.velocityY = 0;
  obstaclesGroup.setVelocityXEach(0);                     
   cloudsGroup.setVelocityXEach(0);
  trex.addAnimation("running",trex_collided);
 
  //set lifetime of the game objects so that they are never destroyed
  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);

 if(gameState ==END) {

  play.mousePressed(function d(){
    reset();
  })
 }
   
  
}
  trex.depth=ground.depth+1
  trex.collide(invisibleGround);
  spawnClouds();
  spawnObstacles();
 
  drawSprites();
  text("Highest Score: "+ highestScore, displayWidth-1500,displayHeight-820);
  text("Score: "+ score, displayWidth-1150,displayHeight-820);
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  play.hide();
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.addAnimation("running",trex_running);
  
  score = 0;
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 30 === 0&&gameState==PLAY) {
    var cloud = createSprite(displayWidth-900,120,40,10);
    cloud.y = Math.round(random(displayHeight-816,displayHeight-776));
    cloud.addImage(cloudImage);
    cloud.scale = 0.05;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 250;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0&&gameState==PLAY) {
    var obstacle = createSprite(displayWidth-900,displayHeight-640,10,40);
    obstacle.velocityX = -(6 + 2*score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
      obstacle.setCollider("circle",0,0,150);
      obstacle.scale = 0.08;
              break;
      case 2: obstacle.addImage(obstacle2);
      obstacle.setCollider("circle",0,0,180);
      obstacle.scale = 0.15;
              break;
      case 3: obstacle.addImage(obstacle3);
      obstacle.setCollider("circle",0,0,120);
      obstacle.scale = 0.12;
              break;
      case 4: obstacle.addImage(obstacle4);
      obstacle.setCollider("circle",0,0,100);
      obstacle.scale = 0.12;
              break;
      case 5: obstacle.addImage(obstacle5);
      obstacle.setCollider("circle",0,0,150);
      obstacle.scale = 0.08;
              break;
      case 6: obstacle.addImage(obstacle6);
      obstacle.setCollider("circle",0,0,180);
      obstacle.scale = 0.15;
              break;
      default: break;
    }

    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);



    if(frameCount % 120 === 0&&gameState==PLAY) {
      var obstacle = createSprite(displayWidth-700,displayHeight-760,10,40);
      obstacle.velocityX = -(6 + 2*score/100);
     
      //generate random obstacles
      var rand = Math.round(random(1,6));
      switch(rand) {
        case 1: obstacle.addImage(obstacle1);
        obstacle.setCollider("circle",0,0,150);
        obstacle.scale = 0.08;
                break;
        case 2: obstacle.addImage(obstacle2);
        obstacle.setCollider("circle",0,0,160);
        obstacle.scale = 0.15;
                break;
        case 3: obstacle.addImage(obstacle3);
        obstacle.setCollider("circle",0,0,120);
        obstacle.scale = 0.12;
                break;
        case 4: obstacle.addImage(obstacle4);
        obstacle.setCollider("circle",0,0,100);
        obstacle.scale = 0.12;
                break;
        case 5: obstacle.addImage(obstacle5);
        obstacle.setCollider("circle",0,0,150);
        obstacle.scale = 0.08;
                break;
        case 6: obstacle.addImage(obstacle6);
        obstacle.setCollider("circle",0,0,160);
        obstacle.scale = 0.15;
                break;
        default: break;
      }
      
      obstacle.lifetime = 300;
      obstaclesGroup.add(obstacle);
  }
}
}
// <iframe src="https://assets.pinterest.com/ext/embed.html?id=618189486343793888" height="713" width="345" frameborder="0" scrolling="no" ></iframe>

       
