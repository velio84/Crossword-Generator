'use strict';

/*
  Takes a string as an input and outputs an array of the words in the string,
  split by a comma, trims the words and uppercases them
*/
function parseStringToArray(str) {

  var array = [];

  str.split(',').forEach(word => {
    word = word.trim().replace(/[^A-z]/g, '').toUpperCase();

    if (word !== '') {
      array.push(word)
    }
  });

  array = array.sort((a, b) => {
    return b.length - a.length;
  });

  return array;
}

/*
Takes a number as input and generates a grid
*/
function generateGrid(len) {
  const multiplier = 5;
  var size = parseInt(len) * multiplier;
  var grid = [];

  for (let i = 0; i < size; i++) {
    let row = new Array(size).fill('~');
    grid.push(row);
  }

  return grid;
}

/*
Takes a word and a grid as an input and places the word in the middle of the grid horizontally
*/
function fillInFirstWord(word, grid) {
  var rowIndex = Math.floor(grid.length / 2);
  var colIndex = Math.floor(grid.length / 3);

  for (let i = colIndex, ch = 0; ch < word.length; i++, ch++) {

    grid[rowIndex][i] = word[ch];

  }

  return grid;
}

/*
Takes a word, a grid and a direction ('horizontal' || 'vertical')
Checks whether any of the word's letters match any letters in the grid
Returns an array of objects, each object consisting of the matched row, column and matched letter's index
*/
function checkMatch(word, grid, fillDirection) {

  var matches = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      for (let ch = 0; ch < word.length; ch++) {
        if (grid[row][col] == word[ch]) {

          let canFit;

          fillDirection === 'vertical' ?
            canFit = grid[row - 1][col] === '~' && grid[row + 1][col] === '~' :
            canFit = grid[row][col - 1] === '~' && grid[row][col + 1] === '~';

          if (canFit) {
            let match = {
              'row': row,
              'col': col,
              'wordLetterIndex': ch
            }

            matches.push(match);
            break;
          }
        }
      }
    }
  }

  return matches;
}

/*
Takes a word and a grid as an input
Checks whether the word can fit vertically somewhere in the gridToDraw
Returns where it can fit or false
*/
function wordFitsVertically(word, grid) {
  var matches = checkMatch(word, grid, 'vertical');

  if (matches.length === 0) {
    return false
  }

  for (let i = 0; i < matches.length; i++) {

    let row = matches[i].row - matches[i].wordLetterIndex;
    let col = matches[i].col;

    if (grid[row - 1][col] === '~' && grid[row + word.length][col] === '~' && grid[row][col - 1] === '~' && grid[row][col + 1] === '~') {

      for (let ch = 0; ch < word.length; ch++, row++) {

        if (grid[row][col] === '~') {

          if (grid[row][col - 1] !== '~' || grid[row][col + 1] !== '~') {
            return false;
          }
        }

        if (grid[row][col] !== word[ch] && grid[row][col] !== '~') {
          return false;
        }
      }

      return matches[i];
    }
  }
}

/*
Takes a word, object with data where the word can fit and a grid as an input
Fills the word inside the grid vertically
*/
function fillWordVertically(word, data, grid) {
  var row = data.row - data.wordLetterIndex;
  var col = data.col;

  for (let ch = 0; ch < word.length; ch++, row++) {
    grid[row][col] = word[ch];
  }
}

/*
Takes a word and a grid as an input
Checks whether the word can fit horizontally somewhere in the gridToDraw
Returns where it can fit or false
*/
function wordFitsHorizontally(word, grid) {
  var matches = checkMatch(word, grid, 'horizontal');

  if (matches.length === 0) {
    return false
  }

  for (let i = 0; i < matches.length; i++) {

    let row = matches[i].row;
    let col = matches[i].col - matches[i].wordLetterIndex;

    if (grid[row][col - 1] === '~' && grid[row][col + word.length] === '~' && grid[row - 1][col] == '~' && grid[row + 1][col] == '~') {

      for (let ch = 0; ch < word.length; ch++, col++) {

        if (grid[row][col] === '~') {

          if (grid[row - 1][col] !== '~' || grid[row + 1][col] !== '~') {
            return false;
          }
        }

        if (grid[row][col] !== word[ch] && grid[row][col] !== '~') {
          return false;
        }
      }

      return matches[i];
    }
  }
}

/*
Takes a word, object with data where the word can fit and a grid as an input
Fills the word inside the grid horizontally
*/
function fillWordHorizontally(word, data, grid) {
  var row = data.row;
  var col = data.col - data.wordLetterIndex;

  for (let ch = 0; ch < word.length; ch++, col++) {
    grid[row][col] = word[ch];
  }
}

/*
Takes a grid as an input
Trims any empty rows and cols on all sides
*/
function trimGrid(grid) {

  grid = trimGridTop(grid);
  grid = trimGridBottom(grid);
  grid = trimGridLeft(grid);
  grid = trimGridRight(grid);

  return grid;
}

// Top slice
function trimGridTop(grid) {
  var regex = /[A-Z]+/,
    indexTop = 0;

  for (let i = 0; i < grid.length; i++) {
    if (regex.test(grid[i].join(''))) {
      indexTop = i;
      break;
    }
  }

  return grid.slice(indexTop);
}

// Bottom slice
function trimGridBottom(grid) {
  var regex = /[A-Z]+/,
    indexBottom = 0;

  for (let i = 0; i < grid.length; i++) {
    if (!regex.test(grid[i].join(''))) {
      indexBottom = i;
      break;
    }
  }

  return grid.slice(0, indexBottom);
}

// Left slice
function trimGridLeft(grid) {
  var regex = /[A-Z]+/,
    indexLeft = 0;

  for (let c = 0; c < grid[0].length; c++) {
    let arr = [];

    for (let r = 0; r < grid.length; r++) {
      arr.push(grid[r][c]);
    }

    if (!regex.test(arr.join(''))) {
      indexLeft++;
    } else {
      break;
    }
  }

  grid = grid.map(row => {
    return row = row.slice(indexLeft);
  });

  return grid;
}

// Right slice
function trimGridRight(grid) {
  var regex = /[A-Z]+/,
    indexRight = 0;

  for (let c = 0; c < grid[0].length; c++) {
    let arr = [];

    for (let r = 0; r < grid.length; r++) {
      arr.push(grid[r][c]);
    }

    if (regex.test(arr.join(''))) {
      indexRight = c;
    }
  }

  grid = grid.map(row => {
    return row = row.slice(0, indexRight + 1);
  });

  return grid;
}

/*
Takes a grid as an input
Generates and returns an HTML table from the provided grid with data
*/
function drawGrid(grid) {
  var table = `<table><tbody>`;

  for (let r = 0; r < grid.length; r++) {
    table += '<tr>';

    for (let c = 0; c < grid[r].length; c++) {

      let isEmpty = grid[r][c] === '~',
        val = isEmpty ? '' : grid[r][c];

      table += `
        <td class="${ isEmpty ? 'empty' : 'letter' }">
          ${ val }
        </td>`;
    }

    table += `</tr>`;
  }

  table += `</tbody></table>`;

  return table;
}


module.exports = {
  parseStringToArray: parseStringToArray,
  generateGrid: generateGrid,
  drawGrid: drawGrid,
  fillInFirstWord: fillInFirstWord,
  checkMatch: checkMatch,
  wordFitsVertically: wordFitsVertically,
  fillWordVertically: fillWordVertically,
  wordFitsHorizontally: wordFitsHorizontally,
  fillWordHorizontally: fillWordHorizontally,
  trimGrid: trimGrid
};
