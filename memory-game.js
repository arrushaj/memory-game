"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

createCards(colors);


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
    if (last.className !== evt.target.className) {
      lockBoard = true;
      setTimeout(unFlipCard, FOUND_MATCH_WAIT_MSECS, last);
      setTimeout(unFlipCard, FOUND_MATCH_WAIT_MSECS, evt.target);
      setTimeout(function (){
        lockBoard = false;
      }, FOUND_MATCH_WAIT_MSECS);
      second = false;
      last = undefined;

    }
    second = false;
    last = undefined;
  }

}
