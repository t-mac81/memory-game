const gameContainer = document.getElementById('game');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const hiddenItems = document.querySelectorAll('.hidden');
const displayMoves = document.querySelector('#moves');
const displayBestScore = document.querySelector('#best-score');
const winText = document.querySelector('#win');
const cards = gameContainer.children;
let bestScore = Number(localStorage.getItem('bestScore')) || 100;
let clickCount = 0;
let moves = 0;
let gameStatus = 0;
const cardArr = [];
const COLORS = [
  'red',
  'blue',
  'green',
  'orange',
  'purple',
  'yellow',
  'red',
  'blue',
  'green',
  'orange',
  'purple',
  'yellow',
];

// Start game button functionality
startButton.addEventListener('click', handleStart);

function handleStart() {
  for (item of hiddenItems) {
    item.classList.toggle('hidden');
  }
  startButton.classList.toggle('hidden');
  startButton.removeEventListener('click', handleStart);
  startButton.style.cursor = 'default';
  stopButton.style.cursor = 'pointer';
  displayBestScore.textContent = `Best Score: ${bestScore}`;
}

// end game button functionality
stopButton.addEventListener('click', handleStop);
function handleStop() {
  location.reload();
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement('div');

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener('click', handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// handle card clicks
function handleCardClick(event) {
  const color = event.target.className;
  clickCount++;
  cardArr.push(color);
  const card = event.target;

  // ensure the same color can't be clicked twice
  card.removeEventListener('click', handleCardClick);

  // manage each 'move' (2 clicks)
  if (clickCount === 2) {
    removeEvents();
    setTimeout(addEvents, 1500);
    setTimeout(hideCards, 1400);
    if (cardArr[0] === cardArr[1]) {
      addMatch(cardArr[0]);
      gameStatus++;
    }
    moves++;
    clickCount = 0;
    cardArr.splice(0, 2);
    displayMoves.textContent = `Moves: ${moves}`;

    // handle game status
    if (gameStatus === 6) finishGame();
  }
  // change card background color
  event.target.style.backgroundColor = color;
}

// remove event listeners from all cards
function removeEvents() {
  for (let card of cards) {
    card.removeEventListener('click', handleCardClick);
  }
}

// add event listeners to all cards
function addEvents() {
  for (let card of cards) {
    card.addEventListener('click', handleCardClick);
  }
}

// add a 'match' className to the two matched cards
function addMatch(color) {
  const matchedCards = document.querySelectorAll(`.${color}`);
  for (let card of matchedCards) {
    card.classList.add('match');
  }
}

// hide cards that were not matched
function hideCards() {
  for (let card of cards) {
    if (!card.classList.contains('match')) card.removeAttribute('style');
  }
}

function finishGame() {
  winText.style.opacity = 1;
  stopButton.textContent = 'Play Again';
  if (moves < bestScore) {
    bestScore = moves;
    displayBestScore.textContent = `Best Score: ${bestScore}`;
    localStorage.setItem('bestScore', bestScore);
  }
}

// when the DOM loads shuffle colors
createDivsForColors(shuffledColors);
