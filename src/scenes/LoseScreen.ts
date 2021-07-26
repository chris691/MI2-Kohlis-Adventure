import Phaser from "phaser"
import { events } from './EventCenter'

export default class LoseScreen extends Phaser.Scene{

    private scoreLabel!: Phaser.GameObjects.Text
    private score


    constructor() {
		super({
            key:'loseScreen'
        });
        
	}
    preload() {
        this.load.image('lose-background', 'assets/loser.png');
        this.load.image('dia', 'assets/diamond2.png')
        this.scene.remove('titleScene')
        
    };

    create(data) {
        this.score = data.score
        events.on('changeToEndscreen', this.setDiamondScore, this)
        this.scene.bringToTop('endScreen')
        
        const winnbg = this.add.image(0,0,'lose-background');
            winnbg.setOrigin(0,0);
            this.add.image(40,77, 'dia')
            .setScale(1)
            this.add.text(65,65, `${this.score}`,{
                fontSize: '32px'
            })
        const text = this.add.text(250,160, 'restart!',{
            fontSize: '22px',
            fontStyle: 'Bold'
        });
        text.setInteractive({ useHandCursor: true });
        text.on('pointerdown', () => this.clickButton());
    };

    private setDiamondScore(score: number){
        this.score = score
    }

    private clickButton() {
        // this.scene.manager.remove('game')
        // this.scene.manager.add('game', start)
        
        this.scene.start('game');
    }



}