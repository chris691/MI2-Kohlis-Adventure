import Phaser from "phaser"

export default class TitleScene extends Phaser.Scene{

    //var titleScene = new Phaser.Scene("title");
    constructor() {
		super({
            key:'titleScene'
        });
	}
    preload(){
        this.load.image('background', 'assets/titleScreenBackground.png');
    };

    create() {
        var bg = this.add.image(0,0,'background');
        bg.setOrigin(0,0);
        // var title = this.add.text(150,100, 'Willkommen zu KOHLIS-ADVENTURE!', {fontFamily: 'Georgia', fontSize: '20px'});
        var text = this.add.text(210,160, 'Neues Spiel starten');
        text.setInteractive({ useHandCursor: true });
        text.on('pointerdown', () => this.clickButton());
    };
    private clickButton() {
        this.scene.start('game')
        // this.scene.start('ui')
        // this.scene.remove('titleScene')
        // this.scene.launch('game')
        
    }

//export default TitleScene;

}