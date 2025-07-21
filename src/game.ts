import * as PIXI from "pixi.js";

export function initGame() {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x202020,
  });

  document.body.appendChild(app.view);

  // ====== LABEL SETUP ======
  const label = new PIXI.Text("1.00x", {
    fontFamily: "Arial",
    fontSize: 64,
    fill: 0xffffff,
  });
  label.anchor.set(0.5);
  label.x = app.screen.width / 2;
  label.y = app.screen.height / 2 - 50;
  app.stage.addChild(label);

  // ====== BUTTON SETUP ======
  const button = new PIXI.Text("Start", {
    fontFamily: "Arial",
    fontSize: 36,
    fill: 0x00ff00,
  });
  button.anchor.set(0.5);
  button.interactive = true;
  button.buttonMode = true;
  button.x = app.screen.width / 2;
  button.y = app.screen.height / 2 + 80;
  app.stage.addChild(button);

  // ====== GAME STATE ======
  let multiplier = 1.0;
  let running = false;
  let cashedOut = false;
  let boomPoint = 0;
  let ticker = new PIXI.Ticker();

  const resetGame = () => {
    multiplier = 1.0;
    cashedOut = false;
    running = false;
    boomPoint = +(Math.random() * 3 + 1.5).toFixed(2);
    label.text = `${multiplier.toFixed(2)}x`;
    label.style.fill = 0xffffff;
    button.text = "Start";
    button.style.fill = 0x00ff00;
  };

  const stopGame = (cashed: boolean) => {
    ticker.stop();
    running = false;

    if (cashed) {
      label.text = `✅ ${multiplier.toFixed(2)}x`;
      label.style.fill = 0x00ffff;
      button.text = "Restart";
      button.style.fill = 0xffff00;
    } else {
      label.text = "💥 BOOM!";
      label.style.fill = 0xff0000;
      button.text = "Retry";
      button.style.fill = 0xff0000;
    }

    // Reset after 2.5 seconds
    setTimeout(() => {
      resetGame();
    }, 2500);
  };

  ticker.add(() => {
    multiplier += 0.01;
    label.text = `${multiplier.toFixed(2)}x`;

    if (multiplier >= boomPoint) {
      stopGame(false);
    }
  });

  button.on("pointerdown", () => {
    if (!running && !cashedOut) {
      // Start game
      resetGame();
      running = true;
      boomPoint = +(Math.random() * 3 + 1.5).toFixed(2);
      button.text = "Cash Out";
      button.style.fill = 0xffcc00;
      ticker.start();
    } else if (running && !cashedOut) {
      // Cash out
      cashedOut = true;
      stopGame(true);
    }
  });

  resetGame(); // Start first state
}
