"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

let gameBoard = document.getElementById('#game');

let count;

let start = document.createElement('button');
start.textContent = 'Start Game!';
start.addEventListener('click', function(){
  const shuffled = shuffle(COLORS);
  createCards(shuffled);
  start.remove();
});

let body = document.querySelector('body');
body.append(start);

// Get possible amount of matchess with count and keep track of matched cards
// with matched


let matched = 0;
let guesses = 0;

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    let card = document.createElement('div');
    card.setAttribute('class', color);
    card.addEventListener('click', handleCardClick);
    gameBoard.append(card);
  }

  count = gameBoard.children.length / 2;
  console.log(count);
  let score = document.createElement('h3');
  score.setAttribute('id', 'score');
  score.textContent = "Total number of guesses: " + guesses;
  gameBoard.append(score);
}

/** Flip a card face-up. */

function flipCard(card) {
  card.style.backgroundColor = card.className;
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.style.backgroundColor = "";
}

/** Handle clicking on a card: this could be first-card or second-card. */
let last = undefined;
let second = false;
let lockBoard = false;

function handleCardClick(evt) {
  let background = evt.target.style.backgroundColor;
  console.log(lockBoard);
  if (evt.target.classList.contains(background) || (lockBoard == true)) {
    return console.log('foo');
  } else {
    flipCard(evt.target);
  }

  if (second === false) {
    second = true;
    last = evt.target;
  } else {
    guesses++;
    let score = document.getElementById('score');
    score.textContent = "Total number of guesses: " + guesses;
    if (last.className !== evt.target.className) {
      lockBoard = true;
      setTimeout(unFlipCard, FOUND_MATCH_WAIT_MSECS, last);
      setTimeout(unFlipCard, FOUND_MATCH_WAIT_MSECS, evt.target);
      setTimeout(function (){
        lockBoard = false;
      }, FOUND_MATCH_WAIT_MSECS);
      second = false;
      last = undefined;

    } else {
      second = false;
      last = undefined;
      matched++;
      console.log(matched);
      if (matched === count) {
        const body = document.querySelector('body');
        let restart = document.createElement('button');
        let message = document.createElement('h3');
        message.textContent = "You Win!";
        restart.textContent = 'Restart Game!';
        restart.addEventListener('click', function(){
          const divs = document.querySelectorAll('#game > div');
          for (let div of divs) {
            div.remove();
          }
          score.remove();
          guesses = 0;
          const shuffled = shuffle(COLORS);
          createCards(shuffled);
          message.remove();
          restart.remove();
          matched = 0;
        });
        body.append(message);
        body.append(restart);

        if (!localStorage.getItem('highScore')) {
          localStorage.setItem('highScore', guesses);
          setTimeout(alert('New high score! ' + guesses + ' guesses!'), 1);
        } else {
          const current = localStorage.getItem('highScore');
          if (guesses < current) {
            setTimeout(alert('New high score! ' + guesses + ' guesses!'), 1);
            localStorage.setItem('highScore', guesses);
          } else {
            setTimeout(alert('Current high score: ' + current + ' guesses!'), 1);
          }
        }
      }

    }
  }



}
