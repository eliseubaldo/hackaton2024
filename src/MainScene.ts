import Phaser from "phaser";
import cindyPNG from "./assets/cindy.png";
import bgPNG from "./assets/background.png";
import cubePNG from "./assets/cubes.png";

export default class MainScene extends Phaser.Scene {
  bg: Phaser.GameObjects.Image;
  cindy: Phaser.Physics.Arcade.Sprite;
  cursors: any;
  facingDirection: string;

  cubeGroup: Phaser.Physics.Arcade.StaticGroup;

  infoText: Phaser.GameObjects.Text;
  infoTextProperties = {
    fontFamily: "NES",
    fontSize: "20px",
    color: "#000000",
    lineSpacing: 22,
    align: "left",
    strokeThickness: 0,
  };
  mathQuestionProperties = {
    fontFamily: "NES",
    fontSize: "40px",
    color: "#000000",
    lineSpacing: 22,
    align: "left",
    strokeThickness: 0,
  };

  answerProperties = {
    fontFamily: "NES",
    fontSize: "40px",
    color: "#0000DE",
    lineSpacing: 22,
    align: "left",
    strokeThickness: 0,
  };

  constructor() {
    super("main");
  }

  loadFont(name, url) {
    let newFont = new FontFace(name, `url(${url})`);
    newFont
      .load()
      .then(function (loaded) {
        document.fonts.add(loaded);
      })
      .catch(function (error) {
        return error;
      });
  }

  preload() {
    this.load.image("background", bgPNG);
    this.load.spritesheet("cindy", cindyPNG, {
      frameWidth: 64,
      frameHeight: 96,
    });
    this.load.spritesheet("cubes", cubePNG, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.loadFont("NES", "fonts/PressStart2P-Regular.ttf");
  }

  create() {
    const text = `Solve the Addition:`;
    const mathQuestion = "3 + ? = 10";
    this.createAnims();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.bg = this.add.image(0, -390, "background").setOrigin(0);
    this.cindy = this.physics.add.sprite(300, 200, "cindy", 0).setScale(2);
    this.cindy.setBodySize(30, 110);
    this.cindy.setOffset(20, 0);
    this.cindy.setCollideWorldBounds(true);
    this.cindy.setY(500);

    this.infoText = this.add.text(5, 5, text, this.infoTextProperties);
    const problemText = this.add.text(
      185,
      155,
      mathQuestion,
      this.mathQuestionProperties
    );

    this.createCubes();

    this.setColliders();
  }

  update(time: number, delta: number): void {
    this.cindyMovement();
  }

  cindyMovement() {
    if (this.facingDirection === "right") {
      this.cindy.resetFlip();
    } else if (this.facingDirection === "left") {
      this.cindy.setFlipX(true);
    }

    if (this.cursors.left.isDown) {
      this.facingDirection = "left";
      this.cindy.setVelocityX(-160);
      this.cindy.anims.play("run", true);
    } else if (this.cursors.right.isDown) {
      this.facingDirection = "right";
      this.cindy.setVelocityX(160);
      this.cindy.anims.play("run", true);
    } else {
      this.cindy.setVelocityX(0);
      this.cindy.anims.play("standing", true);
    }

    if (this.cursors.space.isDown && this.cindy.body.onFloor()) {
      this.cindy.anims.play("jumpUp");
      this.cindy.setVelocityY(-300);
    }

    if (!this.cindy.body.onFloor()) {
      this.cindy.anims.play("jumpUp");
    }

    if (!this.cindy.body.onFloor() && this.cindy.body.velocity.y > 0) {
      this.cindy.anims.play("jumpDown");
    }
  }

  createCubes() {
    this.cubeGroup = this.physics.add.staticGroup();
    let startPos = {
      x: 10,
      y: 290,
    };
    for (let index = 0; index < 10; index++) {
      const cube: Phaser.Physics.Arcade.Sprite = this.cubeGroup.create(
        startPos.x,
        startPos.y,
        "cubes",
        index
      );
      cube.setScale(2);
      cube.setOrigin(0);
      cube.setBodySize(58, 58);
      cube.setOffset(20, 20);
      startPos.x += 80;
      if (index === 7) {
        cube.isRightAnswer = true;
      }
    }
  }

  createAnims() {
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("cindy", { start: 8, end: 13 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "standing",
      frames: this.anims.generateFrameNumbers("cindy", { start: 7, end: 7 }),
      frameRate: 6,
      repeat: 0,
    });

    this.anims.create({
      key: "jumpUp",
      frames: [{ key: "cindy", frame: 12 }],
      frameRate: 10,
    });

    this.anims.create({
      key: "jumpDown",
      frames: [{ key: "cindy", frame: 13 }],
      frameRate: 10,
    });
  }

  setColliders() {
    this.physics.add.collider(
      this.cindy,
      this.cubeGroup,
      (cindy, cube) => {
        this.hitCube(cube);
      },
      null,
      this
    );
  }

  hitCube(cube) {
    if (!cube.isRightAnswer) {
      cube.destroy();
      this.showAnswer(false);
    } else {
      this.showAnswer(true);
      this.handleRightAnswer(cube);
    }
  }

  showAnswer(isCorrect: boolean) {
    const text = isCorrect ? "Correct!" : "Try again!";
    const answerText = { ...this.answerProperties };
    answerText.color = isCorrect ? "#0000DE" : "#DE0000";

    const tweenTextUp = this.add.text(380, 295, text, answerText);
    tweenTextUp.setAlpha(0);
    tweenTextUp.setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: tweenTextUp,
      y: 235,
      alpha: 1,
      onComplete: () => {
        tweenTextUp.destroy();
      },
    });
  }

  handleRightAnswer(cube) {
    this.tweens.add({
      targets: cube,
      y: 140,
      x: 320,
      ease: "Sine.easeOut",
      duration: 1000,
    });
    this.cubeGroup.children.each((groupCube) => {
      if (groupCube !== cube) {
        groupCube.destroy();
      }
    });
  }
}
