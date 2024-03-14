import Phaser from 'phaser'

import MainScene from './MainScene'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: { y: 650 },
		},
	},

	scene: [MainScene],
}

export default new Phaser.Game(config)
