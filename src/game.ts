import * as PIXI from "pixi.js";

let app: PIXI.Application;
let multiplierText: PIXI.Text;
let multiplier = 1.0;
let isRunning = true;
let intervalId: number;
let boomPoint = Math.random() * 10 + 1; // random boom between 1s and 11s

export function initGame(
  cashoutCallback: (value: number, boom: boolean) => void
) {
  app = new PIXI.Application({
    view: document.getElementById("game-canvas") as HTMLCanvasElement,
    width: 400,
    height: 300,
    backgroundColor: 0x222222,
  });

  multiplierText = new PIXI.Text("1.00x", {
    fill: "white",
    fontSize: 64,
    fontWeight: "bold",
  });

  multiplierText.anchor.set(0.5);
  multiplierText.x = app.screen.width / 2;
  multiplierText.y = app.screen.height / 2;

  app.stage.addChild(multiplierText);

  intervalId = window.setInterval(() => {
    if (!isRunning) return;
    multiplier += 0.01;
    multiplierText.text = `${multiplier.toFixed(2)}x`;

    if (multiplier >= boomPoint) {
      isRunning = false;
      cashoutCallback(multiplier, true);
    }
  }, 100);
}

export function cashOut(): number {
  if (isRunning) {
    isRunning = false;
    clearInterval(intervalId);
    return multiplier;
  }
  return 0;
}
