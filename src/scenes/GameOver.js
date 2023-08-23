import Phaser from '../lib/phaser.js'

export default class GameOver extends Phaser.Scene
{
    constructor()
    {
        super('game-over');
    }

    create()
    {
        // Using ScaleManager to get the game width and height.
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width * 0.5, height *0.5, 'Game Over', {
            fontSize: 48
        })
            .setOrigin(0.5)

        // restart game if press SPACE
        // .once is used as InputManager clean itself up by using it
        this.input.keyboard.once('keydown-SPACE', () =>{
            
            this.scene.start('game')
        })

    }
}