import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {

	bg: Phaser.GameObjects.Image;
	cindy: Phaser.Physics.Arcade.Sprite;
	cubesGroup: Phaser.Physics.Arcade.StaticGroup;

	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('background', '../background.png');
		this.load.spritesheet('cindy', '../cindy.png', {frameWidth: 64, frameHeight: 96});
		this.load.spritesheet('cubes', '../cubes.png', {frameWidth: 32, frameHeight: 32})
	}

	create() {
		this.bg = this.add.image(0, -390, 'background').setOrigin(0);
		this.cindy = this.physics.add.sprite(300,200, 'cindy', 0).setScale(2);
		this.cindy.setBodySize(30, 110);
		this.cindy.setOffset(20,0);
		this.cindy.setCollideWorldBounds(true);
		

	}
}
