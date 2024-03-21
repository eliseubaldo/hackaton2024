import Phaser from "phaser";

import MainScene from "./MainScene";

const testCB = (answer) => {
  alert(answer)
}

const config = {
  type: Phaser.AUTO,
  parent: "HackathonActivity",
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 850 },
    },
  },
  

  scene: [MainScene],
};

export function startGame(answerCallback, questionAnswerObj) {
  const game = new Phaser.Game(config);
  game.scene.start('main', {classCraftCB: answerCallback, questionAnswerObj})
}
