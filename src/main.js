require("!style!css!less!./styles.less");
var crossWordService = require('./crossword-service');

var form = document.forms[0];
var projection = document.getElementById('projection');
var wordsEnteredDomEl = document.getElementById('words-entered');
var wordsLeftDomEl = document.getElementById('words-left');

// The array of words we'll parse from the user input
var wordsInput = [];

// The array of words we'll be trying to fit the crossword with
var words = [];


/*
 We will try to fill the crossword in 2 ways:
 - trying to fill a word horizontally first
 - trying to fill a word vertically first

 In the end we'll use the one that has less words left that can't be fitted into the crossword
*/
var horizontalGrid = [];
var horizontalGridWordsLeft = [];

var verticalGrid = [];
var verticalGridWordsLeft = [];

var gridToDraw = [];
var wordsLeft = [];


// Gets the input of words from the textarea upon hitting 'Submi' button
form.addEventListener('submit', (e) => {

  e.preventDefault();

  var value = form.elements[0].value;

  // Parses the input string into an array
  wordsInput = crossWordService.parseStringToArray(value);

  // Gets the length of the first word from the array and uses it as a starting point for the grid
  var maxWordLength = wordsInput[0].length;


  // Generates empty grids
  horizontalGrid = crossWordService.generateGrid(maxWordLength);
  verticalGrid = crossWordService.generateGrid(maxWordLength);

  generateCrossword()
});




function generateCrossword() {

  // Creates a new array with words that we need to place into the crossword
  words = wordsInput.slice();

  crossWordService.fillInFirstWord(wordsInput[0], horizontalGrid);
  crossWordService.fillInFirstWord(wordsInput[0], verticalGrid);

  //Removes the first word from the array as it's already filled into the crossword
  words.shift();

  // Generates the first crossword as a grid
  generateHorizontalGrid(words, horizontalGrid, horizontalGridWordsLeft);

  // Generates the second crossword as a grid
  generateVerticalGrid(words, verticalGrid, verticalGridWordsLeft);

  // Determines which grid has fewer left words and draws it on the screen
  chooseCrossword();


  /*
    As the service to trim the grid takes some time to complete,
    we create a promise for this task and fill the DOM with the data once the promise is resolved
  */
  var trimGrid = new Promise((resolve, reject) => resolve(crossWordService.trimGrid(gridToDraw)));

  trimGrid.then((grid) => {

    fillDataToDOM(grid, wordsInput, wordsLeft);

    resetData();
  });
}


/*
These 2 functions (generateHorizontalGrid and generateVerticalGrid) can be optimized and combined into a single function, but not enough time to refactor at the moment...
*/
function generateHorizontalGrid(words, grid, gridWordsLeft) {
  words.forEach(w => {
    let verticalFit = crossWordService.wordFitsVertically(w, grid);
    let horizontalFit = crossWordService.wordFitsHorizontally(w, grid);

    if (horizontalFit) {
      crossWordService.fillWordHorizontally(w, horizontalFit, grid);
    } else if (verticalFit) {
      crossWordService.fillWordVertically(w, verticalFit, grid);
    } else {
      gridWordsLeft.push(w);
    }
  });
}

function generateVerticalGrid(words, grid, gridWordsLeft) {
  words.forEach(w => {
    let verticalFit = crossWordService.wordFitsVertically(w, grid);
    let horizontalFit = crossWordService.wordFitsHorizontally(w, grid);

    if (horizontalFit) {
      crossWordService.fillWordHorizontally(w, horizontalFit, grid);
    } else if (verticalFit) {
      crossWordService.fillWordVertically(w, verticalFit, grid);
    } else {
      gridWordsLeft.push(w);
    }
  });
}


// Checks which grid has fewer unused words and assigns that grid as the crossword to be displayed
function chooseCrossword(horizontal, vertical) {
  if (horizontalGridWordsLeft.length < verticalGridWordsLeft.length) {
    gridToDraw = horizontalGrid.slice();
    wordsLeft = horizontalGridWordsLeft.slice();
  } else {
    gridToDraw = verticalGrid.slice();
    wordsLeft = verticalGridWordsLeft.slice();
  }
}


// Fills data into the DOM
function fillDataToDOM(grid, wordsInput, wordsLeft) {
  projection.innerHTML = crossWordService.drawGrid(grid);
  wordsEnteredDomEl.innerHTML = `<em>Words submitted: ${wordsInput.join(', ')}</em>`;
  wordsLeftDomEl.innerHTML = `<em>${wordsLeft.length > 0 ? 'Words left: ' + wordsLeft.join(', ') : ''}</em>`;
}

// Resets the input text area and the arrays we created earlier to work with
function resetData() {
  form.elements[0].value = '';

  wordsInput = [];

  horizontalGrid = [];
  horizontalGridWordsLeft = [];

  verticalGrid = [];
  verticalGridWordsLeft = [];
}
