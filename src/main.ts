import Phaser from 'phaser'

import Game from './scenes/Game'
import UI from './scenes/UI'
import TitleScene from './scenes/TitleScene'
import EndScreen from './scenes/EndScreen'
import LoseScreen from './scenes/LoseScreen'
const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 600,
	height: 600,
	physics: {
		default: 'matter',
		matter: {
			debug: false
		}
	},
	scene: [TitleScene, Game, UI, EndScreen, LoseScreen]
}

export default new Phaser.Game(config)
