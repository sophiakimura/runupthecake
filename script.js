const bird = document.getElementById('bird');
const obstacle = document.getElementById('obstacle');

let birdTop = 200; // Starting position of the bird
let birdGravity = 2; // Gravity pulling the bird down
let birdJump = -30; // Jump height
let obstacleLeft = 300; // Starting position of the obstacle
let obstacleHeight = 175; // Default candle height
let previousHeight = 175; // Track the previous height
let isGameOver = false;
let gameLoop; // Declare game loop globally

// Bird jump on tap
document.addEventListener('click', () => {
  if (!isGameOver) {
    birdTop += birdJump;
    bird.style.top = `${birdTop}px`;
  }
});

// Detect collision with a custom hitbox
const detectCollision = () => {
  const birdRect = bird.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  // Define the bird's visible hitbox
  const birdHitbox = {
    top: birdRect.top + 10,
    bottom: birdRect.bottom - 10,
    left: birdRect.left + 10,
    right: birdRect.right - 10,
  };

  if (
    birdHitbox.right > obstacleRect.left &&
    birdHitbox.left < obstacleRect.right &&
    birdHitbox.bottom > obstacleRect.top &&
    birdHitbox.top < obstacleRect.bottom
  ) {
    gameOver();
  }
};

// Randomize candle height (validate and fix wick-only issue)
const randomizeObstacleHeight = () => {
  let newHeight;

  // Ensure significant height difference compared to the previous candle
  do {
    newHeight = Math.floor(Math.random() * 100) + 150; // Height between 150px and 250px
  } while (Math.abs(newHeight - previousHeight) < 50); // Ensure at least 50px difference

  // Enforce a minimum height to prevent wick-only issue
  obstacleHeight = Math.max(newHeight, 150); // Minimum height is 150px
  previousHeight = obstacleHeight; // Update the last height

  // Adjust the obstacle's height
  obstacle.style.height = `${obstacleHeight}px`;
  obstacle.style.bottom = `-50px`; // Attach the candle base to the floor

  // Verify and fix alignment issues
  setTimeout(() => {
    const obstacleRect = obstacle.getBoundingClientRect();
    const gameContainerHeight = document.getElementById('game-container').offsetHeight;
    if (obstacleRect.bottom < gameContainerHeight) {
      // Correct any floating by extending the height
      const missingHeight = gameContainerHeight - obstacleRect.bottom;
      obstacle.style.height = `${obstacleHeight + missingHeight}px`;
      obstacle.style.bottom = `0px`;
    }
  }, 0);
};

// Main game update loop
const updateGame = () => {
  if (isGameOver) return;

  // Apply gravity to the bird
  birdTop += birdGravity;
  bird.style.top = `${birdTop}px`;

  // Move the obstacle
  obstacleLeft -= 5;
  if (obstacleLeft < -50) {
    obstacleLeft = 300; // Reset obstacle position
    randomizeObstacleHeight(); // Adjust the candle height
  }
  obstacle.style.left = `${obstacleLeft}px`;

  // Check for collisions
  detectCollision();

  // Check if the bird hits the ground or flies off-screen
  if (birdTop > 470 || birdTop < 0) {
    gameOver();
  }
};

// Game Over logic
const gameOver = () => {
  isGameOver = true;
  clearInterval(gameLoop); // Stop the game loop
  if (confirm('Game Over! Do you want to play again?')) {
    restartGame();
  }
};

// Restart the game
const restartGame = () => {
  isGameOver = false;
  birdTop = 200; // Reset bird position
  obstacleLeft = 300; // Reset obstacle position
  bird.style.top = `${birdTop}px`;
  obstacle.style.left = `${obstacleLeft}px`;

  // Randomize obstacle height on restart
  randomizeObstacleHeight();

  // Restart the game loop
  startGameLoop();
};

// Start the game loop
const startGameLoop = () => {
  gameLoop = setInterval(updateGame, 20);
};

// Initialize the game
randomizeObstacleHeight(); // Set initial obstacle height
startGameLoop();
