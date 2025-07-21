import { initGame, cashOut } from "./game";

const statusText = document.getElementById("status")!;
const button = document.getElementById("cashout")!;

initGame((value, exploded) => {
  if (exploded) {
    statusText.textContent = `💥 Boom! You lost at ${value.toFixed(2)}x`;
  }
});

button?.addEventListener("click", () => {
  const payout = cashOut();
  if (payout > 0) {
    statusText.textContent = `✅ You cashed out at ${payout.toFixed(2)}x`;
  }
});
