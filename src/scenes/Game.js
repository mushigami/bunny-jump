import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene
{       
    // create static physics body group for the platforms
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player;

    constructor()
    {
        super('Game')


    }

    preload()
    {
        this.load.image('background',"../assets/bg_layer1.png");
        this.load.image('platform', "../assets/ground_grass.png");
        this.load.image('bunny-stand', "../assets/bunny1_stand.png");
    }

    makePlatforms(){
        
        this.platforms = this.physics.add.staticGroup();
        // create 5 platforms with random x and y-150px apart
        for(let i = 0; i < 5 ; i++){
            const x = Phaser.Math.Between(80, 400);
            const y = 150 * i;

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x,y,'platform');
            platform.scale = 0.5;

            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject();
        }

    }
    create()
    {
        this.add.image(240,320,'background')
            .setScrollFactor(1,0);

        this.makePlatforms();

        // create bunny
        this.player = this.physics.add.sprite(240, 320, 'bunny-stand')
            .setScale(0.5);
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;


        this.physics.add.collider(this.platforms, this.player)

        this.cameras.main.startFollow(this.player);
    }

    update(){


        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child;

            const scrollY = this.cameras.main.scrollY;
            if(platform.y >= scrollY + 700)
            {
                platform.y = scrollY - Phaser.Math.Between(50, 100);
                platform.body.updateFromGameObject();
            }
        })

        const touchingDown = this.player.body.touching.down;
        if(touchingDown){
            this.player.setVelocityY(-300);
        }
    }

}