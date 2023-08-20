import Phaser from '../lib/phaser.js'
import Carrot from '../game/Carrot.js'

export default class Game extends Phaser.Scene
{       
    // create static physics body group for the platforms
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player;

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors;

    /** @type {Phaser.Physics.Arcade.Group} */
    carrots;

    constructor()
    {
        super('Game')


    }

    preload()
    {
        this.load.image('background',"../assets/bg_layer1.png");
        this.load.image('platform', "../assets/ground_grass.png");
        this.load.image('bunny-stand', "../assets/bunny1_stand.png");
        this.load.image('carrot', "../assets/carrot.png")
        this.cursors = this.input.keyboard.createCursorKeys();

    }

    makePlatforms(){
        
        this.platforms = this.physics.add.staticGroup();
        // create 5 platforms with random x and y-150px apart
        for (let i = 0; i < 5; ++i)
		{
			const x = Phaser.Math.Between(80, 400)
			const y = 150 * i
	
			/** @type {Phaser.Physics.Arcade.Sprite} */
			const platform = this.platforms.create(x, y, 'platform')
			platform.scale = 0.5
	
			/** @type {Phaser.Physics.Arcade.StaticBody} */
			const body = platform.body
			body.updateFromGameObject()
		}

    }

    horizontalWrap(sprite){
        const halfWidth = sprite.displayWidth * 0.5;
        const gameWidth = this.scale.width;
        if(sprite.x < -halfWidth){
            sprite.x = gameWidth + halfWidth;
        }
        else if(sprite.x > gameWidth + halfWidth){
            sprite.x = -halfWidth
        }
    }

    addCarrotAbove(sprite){
        const y = sprite.y - sprite.displayWidth

        /** @type {Phaser.Physics.Arcade.Sprite} */
        const carrot = this.carrots.get(sprite.x, y, 'carrot');

        // set active and visible
        carrot.setActive(true);
        carrot.setVisible(true)

        this.add.existing(carrot)

        // update the physics body size
        carrot.body.setSize(carrot.width, carrot.height)

        // make sure body is enabled in the physics world
        this.physics.world.enable(carrot)
    }

    handleCollectCarrot(player, carrot){
        // hide from display
        this.carrots.killAndHide(carrot);

        // disable from physics world
        this.physics.world.disableBody(carrot.body);

    }
    create()
    {
        // create background
        this.add.image(240,320,'background')
            .setScrollFactor(1,0);

        // create platforms
        this.makePlatforms();

        // create bunny
        this.player = this.physics.add.sprite(240, 320, 'bunny-stand')
            .setScale(0.5);
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        // create carrot
        this.carrots = this.physics.add.group({
            classType:Carrot
        })
        this.carrots.get(240, 320, 'carrot')



        this.physics.add.collider(this.platforms, this.player)
        this.physics.add.collider(this.carrots, this.platforms)
        this.physics.add.overlap(
            this.player,
            this.carrots,
            this.handleCollectCarrot,
            undefined,
            this
        )

        this.cameras.main.startFollow(this.player);

        // horizontal deadzone is 1.5 times the width
        this.cameras.main.setDeadzone(this.scale.width * 1.5);
    }

    update(){


        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child;

            const scrollY = this.cameras.main.scrollY;
			if (platform.y >= scrollY + 700)
			{
				platform.y = scrollY - Phaser.Math.Between(50, 100)
				platform.body.updateFromGameObject()

                // create a carrot above the platform being reused.
                this.addCarrotAbove(platform);
            }
        })

        const touchingDown = this.player.body.touching.down;
        if(touchingDown){
            this.player.setVelocityY(-300);
        }

        if(this.cursors.left.isDown && !touchingDown){
            this.player.setVelocityX(-200);
        }
        else if(this.cursors.right.isDown && !touchingDown){
            this.player.setVelocityX(200);
        }
        else{
            this.player.setVelocityX(0);
        }


        this.horizontalWrap(this.player);
    }

}