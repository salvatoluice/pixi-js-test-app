import * as PIXI from "pixi.js";

export function initGame() {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x202020,
  });
  document.body.appendChild(app.view);

  // ===== UI ELEMENTS =====
  const container = new PIXI.Container();
  app.stage.addChild(container);

  const label = new PIXI.Text("1.00x", {
    fontFamily: "Arial",
    fontSize: 64,
    fill: 0xffffff,
  });
  label.anchor.set(0.5);
  label.position.set(app.screen.width / 2, app.screen.height / 2 - 40);
  container.addChild(label);

  const button = new PIXI.Text("Start", {
    fontFamily: "Arial",
    fontSize: 36,
    fill: 0x00ff00,
  });
  button.anchor.set(0.5);
  button.interactive = true;
  button.buttonMode = true;
  button.position.set(app.screen.width / 2, app.screen.height / 2 + 100);
  container.addChild(button);

  const countdownText = new PIXI.Text("", {
    fontFamily: "Arial",
    fontSize: 48,
    fill: 0xffcc00,
  });
  countdownText.anchor.set(0.5);
  countdownText.position.set(app.screen.width / 2, app.screen.height / 2);
  container.addChild(countdownText);

  // ===== GAME STATE =====
  let gameState: "IDLE" | "COUNTDOWN" | "RUNNING" | "BOOMED" | "CASHED_OUT" =
    "IDLE";
  let multiplier = 1.0;
  const rate = 0.01;
  let boomPoint = 0;
  let cashedOut = false;

  const ticker = app.ticker;
  ticker.autoStart = false;

  // ===== STATE MACHINE =====
  const startCountdown = () => {
    gameState = "COUNTDOWN";
    let counter = 3;
    countdownText.text = `${counter}`;
    const countdown = setInterval(() => {
      counter--;
      if (counter <= 0) {
        clearInterval(countdown);
        countdownText.text = "";
        startGame();
      } else {
        countdownText.text = `${counter}`;
      }
    }, 1000);
  };

  const startGame = () => {
    gameState = "RUNNING";
    multiplier = 1.0;
    boomPoint = +(Math.random() * 3 + 1.5).toFixed(2);
    cashedOut = false;
    label.text = "1.00x";
    label.style.fill = 0xffffff;
    button.text = "Cash Out";
    button.style.fill = 0xffcc00;
    ticker.start();
  };

  const endGame = (cashed: boolean) => {
    gameState = cashed ? "CASHED_OUT" : "BOOMED";
    ticker.stop();

    if (cashed) {
      label.text = `✅ ${multiplier.toFixed(2)}x`;
      label.style.fill = 0x00ffff;
    } else {
      label.text = "💥 BOOM!";
      label.style.fill = 0xff0000;
      flashBackground();
    }

    button.text = "Restart";
    button.style.fill = 0x00ff00;

    setTimeout(() => {
      gameState = "IDLE";
      label.text = "1.00x";
      label.style.fill = 0xffffff;
      button.text = "Start";
    }, 2500);
  };

  // ===== FLASH BG EFFECT =====
  function flashBackground() {
    const flash = new PIXI.Graphics();
    flash.beginFill(0xff0000, 0.4);
    flash.drawRect(0, 0, app.screen.width, app.screen.height);
    flash.endFill();
    container.addChild(flash);

    setTimeout(() => {
      container.removeChild(flash);
    }, 200);
  }

  // ===== MULTIPLIER TICK =====
  ticker.add((delta) => {
    multiplier += rate * delta;
    label.text = `${multiplier.toFixed(2)}x`;

    // Animate label
    label.scale.set(1 + Math.sin(performance.now() / 200) * 0.05);

    if (multiplier >= boomPoint) {
      endGame(false);
    }
  });

  // ====== BUTTON INTERACTION ======
  button.on("pointerdown", () => {
    if (gameState === "IDLE") {
      startCountdown();
    } else if (gameState === "RUNNING" && !cashedOut) {
      cashedOut = true;
      endGame(true);
    }
  });
}
