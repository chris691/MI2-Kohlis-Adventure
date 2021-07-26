import Phaser from "phaser"
import { events } from './EventCenter'

export default class EndScreen extends Phaser.Scene{

    private scoreLabel!: Phaser.GameObjects.Text
    private score = 0
    private gameScene

    constructor(gameScene: Phaser.Scene) {
		super({
            key:'endScreen'
        });
        this.gameScene = gameScene
	}
    preload() {
        this.load.image('winn-background', 'assets/winning.png');
        this.load.image('dia', 'assets/diamond2.png')
        this.scene.remove('titleScene')
        
    };

    create(data) {
        
        this.score = data.score
        this.scene.bringToTop('endScreen')
        
        const winnbg = this.add.image(0,0,'winn-background');
            winnbg.setOrigin(0,0);
        this.add.image(40,77, 'dia')
        .setScale(1)
        this.add.text(65,65, `${this.score}`,{
            fontSize: '32px'
        })
        const restart = this.add.text(245,400, 'restart!', {
            color: '0x00ff00',
            fontSize: '22px',
            fontStyle: 'Bold'
        });
        restart.setInteractive({ useHandCursor: true });
        restart.on('pointerdown', () => this.clickButton());
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