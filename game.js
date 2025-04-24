
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const TILE_SIZE = 32;
const worldWidth = 25;
const worldHeight = 15;

const world = Array.from({ length: worldHeight }, (_, y) =>
  Array.from({ length: worldWidth }, (_, x) => (y === worldHeight - 1 ? 1 : 0))
);

let inventory = new Array(10).fill(0);
let selectedSlot = 0;

const player = {
  x: 100,
  y: 100,
  width: 32,
  height: 48,
  velocityY: 0,
  speed: 4
};

const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key >= '1' && e.key <= '9') {
    selectedSlot = parseInt(e.key) - 1;
  }
});
document.addEventListener("keyup", (e) => keys[e.key] = false);

function update() {
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;

  player.x = Math.max(0, Math.min(player.x, worldWidth * TILE_SIZE - player.width));

  const tileX = Math.floor(player.x / TILE_SIZE);
  const tileYBelow = Math.floor((player.y + player.height) / TILE_SIZE);

  if (
    tileX >= 0 && tileX < worldWidth &&
    tileYBelow >= 0 && tileYBelow < worldHeight &&
    world[tileYBelow][tileX] === 0
  ) {
    player.velocityY += 1;
  } else {
    player.velocityY = 0;
    player.y = tileYBelow * TILE_SIZE - player.height;
  }

  player.y += player.velocityY;

  if (player.y > canvas.height - player.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0;
  }
}

function drawWorld() {
  for (let y = 0; y < worldHeight; y++) {
    for (let x = 0; x < worldWidth; x++) {
      if (world[y][x] === 1) {
        ctx.fillStyle = "#654321";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawInventory() {
  for (let i = 0; i < inventory.length; i++) {
    ctx.fillStyle = "black";
    ctx.fillRect(10 + i * 34, canvas.height - 40, 32, 32);
    if (i === selectedSlot) {
      ctx.strokeStyle = "yellow";
      ctx.strokeRect(10 + i * 34, canvas.height - 40, 32, 32);
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawWorld();
  drawPlayer();
  drawInventory();
  requestAnimationFrame(gameLoop);
}

gameLoop();
