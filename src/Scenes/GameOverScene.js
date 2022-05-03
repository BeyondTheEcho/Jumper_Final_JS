import Phaser from 'phaser';

let score = 0;

class GameOverScene extends Phaser.Scene 
{
    constructor(config)
    {
        super('GameOverScene');
    }

    init(obj)
    {
        this.config = obj.config;
        this.score = obj.score;
    }
    

    create ()
    {
        this.A_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.gameOverText = this.add.text( 
            this.config.width / 2, 
            this.config.height / 2, 
            `GAME OVER`, 
            {font: "100px Arial Black",
             fill: "#fff"})
            .setOrigin(0.5);

        this.scoreText = this.add.text( 
            this.config.width / 2, 
            this.config.height / 2 + 100 ,
             `Score: ${this.score}`,
              {font: "50px Arial Black",
               fill: "#fff"}).setOrigin(0.5);

        this.replayText = this.add.text( 
            this.config.width / 2,
             (this.config.height / 2) + 200 ,
              "Press A To Play Again!",
               {font: "50px Arial Black",
                fill: "#fff"}).setOrigin(0.5);
    }

    update()
    {
        if(this.A_Key.isDown)
        {
            this.scene.start('PlayScene');
        }
    }
}

export default GameOverScene;