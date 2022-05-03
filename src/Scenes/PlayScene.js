import Phaser from 'phaser';
import GameOverScene from './GameOverScene';

//Pipes To Render
const PIPES_TO_RENDER = 6;

//Platform Position Vars
let platformsRecycled = -3;

//Distance the player moves per update
let moveDistance = 5;

//Init Var
let pipeInit = false;

//Score Vars
let score = 0;
let difficultyLevel = 1;

//Platform Vars
let platformVel = 50;
let difficultyIndex = 7;

let isColliding = true;

let timer;

class PlayScene extends Phaser.Scene 
{

  constructor(config) 
  {
    super('PlayScene');
    this.config = config;

    this.player = null;
    this.platforms = null;

    this.pipeHorizontalDistance = 0;
    this.jumpVelocity = 500;
  }

  preload() 
  {
    this.load.image('sky', 'assets/sky2.png');
    this.load.image('bird', 'assets/Character.png');
    this.load.image('pipe', 'assets/pipe.png');
  }

  create() 
  {
    this.createBackground();
    this.createPlayer();
    this.createPlatforms();
    this.createBasePlatform();
    this.createColliders();
    this.ScoreTimer();

    platformVel = 50;
    difficultyLevel = 0;
    score = 0;
    this.scoreText = this.add.text( 10, 15, `Score: ${score}`, {font: "30px Arial Black", fill: "#fff"});
    this.difficultyText = this.add.text( 10, 45, `Difficulty: ${difficultyLevel}`, {font: "30px Arial Black", fill: "#fff"});

    this.W_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.A_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.S_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.D_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    console.log(this.physics);


    //this.player.body.onCollide.add = () => console.log("Test");
    //this.player.setOnCollideEnd(() => isColliding = false);
  }

  update() 
  {
    this.checkGameStatus();
    this.handleInputs();
    this.RecyclePlatforms();
    this.IncreaseDifficulty();

    this.scoreText.setText(`Score: ${score}`);
    this.difficultyText.setText(`Difficulty: ${difficultyLevel}`);

    console.log(isColliding);
  }

  IncreaseDifficulty()
  {
    if (difficultyIndex == platformsRecycled)
    {
      platformVel += 20;

      this.platforms.setVelocityY(platformVel);

      difficultyLevel++;
      difficultyIndex += 7;
    }
  }

  ScoreTimer()
  {
    if (timer !== undefined)
    {
      clearInterval(timer);
    }
  
    timer = window.setInterval(() => score += 10, 1000);
  }

  createBackground()
  {
    this.add.image(0, 0, 'sky').setOrigin(0);
  }

  createPlayer()
  {
    this.player = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0).setScale(2,2);
    this.player.body.gravity.y = 500;
    this.player.setCollideWorldBounds(true);
  }

  createPlatforms()
  {
    this.platforms = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) 
    {
      const leftPipe = this.platforms
        .create(0, 0, 'pipe')
        .setImmovable(true)
        .setScale(1,0.5)
        .setOrigin(0, 0);
      const rightPipe = this.platforms
        .create(0, 0, 'pipe')
        .setImmovable(true)
        .setScale(1,0.5)
        .setOrigin(0, 0);

      this.placePlatforms(leftPipe, rightPipe)
    }

    this.platforms.setVelocityY(platformVel);
  }

  createBasePlatform()
  {
    this.basePlatforms = this.physics.add.group();

    const basePlatform = this.basePlatforms
    .create(0, 0, 'pipe')
    .setImmovable(true)
    .setOrigin(0.5, 0.5);

    basePlatform.x = this.config.width / 2;
    basePlatform.y = this.config.height;

    basePlatform.setVelocityY(1);
  }

  handleInputs()
  {
    this.input.on('pointerdown', this.Jump, this);
    this.input.keyboard.on('keydown_SPACE', this.Jump, this);

    if(this.D_Key.isDown)
    {
      this.player.x += moveDistance;
    }

    if(this.A_Key.isDown)
    {
      this.player.x -= moveDistance;
    }

    if(this.S_Key.isDown)
    {
      this.player.y += moveDistance;
    }
  }

  //Checks if the player hit the boundaries of the screen
  checkGameStatus()
  {
    if (this.player.getBounds().bottom >= this.config.height || this.player.y <= 0) 
    {
      this.gameOver();
    }
  }

  //Creates colliders for the two physics groups
  createColliders() 
  {
    this.physics.add.collider(this.player, this.platforms, (collisionObj) => isColliding = true, null, this);

    this.physics.add.collider(this.player, this.basePlatforms, (collisionObj) => isColliding = true, null, this);
  }

  ResetPlayerPos()
  {
    player.x = this.config.startPosition.x;
    player.y = this.config.startPosition.y;
    this.player.body.velocity.y = 0;
  }

  placePlatforms(lPipe, rPipe) 
  {
    this.rootPipeXOffset = [0, 100];
    this.pipeVerticalDistanceRange = [-100, -150];
    this.pipeHorizontalDistanceRange = [600, 700];
    let xPos = 0;
    let yPos = 0

    if (pipeInit === false)
    {
      xPos = -200;
      yPos = 400;
      pipeInit = true;
    }
    else
    {
      xPos = -200;
      yPos = this.getHighestPipe();
    }

    lPipe.x = xPos + Phaser.Math.Between(...this.rootPipeXOffset);
    lPipe.y = yPos + Phaser.Math.Between(...this.pipeVerticalDistanceRange);

    rPipe.x = lPipe.x + Phaser.Math.Between(...this.pipeHorizontalDistanceRange)
    rPipe.y = lPipe.y + Phaser.Math.Between(...this.pipeVerticalDistanceRange);

    platformsRecycled++;
  }

  RecyclePlatforms() 
  {
    const tempPlatforms = [];
    this.platforms.getChildren().forEach(pipe => {
      if (pipe.y > 650) 
      {
        tempPlatforms.push(pipe);

        if (tempPlatforms.length === 2) 
        {
          this.placePlatforms(...tempPlatforms);
        }
      }
    })
  }

  getHighestPipe() 
  {
    let highestY = 600;

    this.platforms.getChildren().forEach(function(pipe) 
    {
      highestY = Math.min(pipe.y, highestY);
    })

    return highestY;
  }

  gameOver() 
  {
    this.physics.pause();
    this.player.setTint(0xff0000);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        //this.scene.restart();
        let config = this.config;
        this.scene.start('GameOverScene' , {config, score});
      },
      loop: false
    })
  }

  Jump() 
  {
    if (isColliding)
    {
      this.player.body.velocity.y = -this.jumpVelocity;

      isColliding = false;
    }
  }
}

export default PlayScene;