var expect = require('chai').expect;
var cwService = require('../src/crossword-service');

describe('Crossword Service', () => {

  describe('parseStringToArray', () => {
    it('should parse string to array and uppercase it', () => {
      var arr = cwService.parseStringToArray('bulgaria');

      expect(arr = ['BULGARIA']);
    });

    it('should sort the longest word upfront alphabetically', () => {
      var arr = cwService.parseStringToArray('jon, mike, adam');

      expect(arr = ['ADAM', 'MIKE', 'JON']);
    });

    it('should trim whitespaces', () => {
      var arr = cwService.parseStringToArray('   mike  ,  adam   ,  ');

      expect(arr = ['ADAM', 'MIKE']);
    });

    it('should trim non-alphabetic characters', () => {
      var arr = cwService.parseStringToArray('fo0t<b>aL!l');

      expect(arr = ['FOTBALL']);
    });
  })

  describe('generateGrid', () => {
    it('should generate a grid', () => {
      var grid = cwService.generateGrid(2);

      expect(grid.length === 10 && grid[0].length === 10);
    });

    it('should fill each cell with the ~ symbol', () => {
      var grid = cwService.generateGrid(2);

      expect(grid[0][5]).to.equal('~');
    });
  });

  describe('fillInFirstWord', () => {
    it('should place the word horizontally in the middle of the grid', () => {
      var grid = cwService.generateGrid(1);
      var filledGrid = cwService.fillInFirstWord('CAR', grid);

      expect(/CAR/.test(filledGrid[2].join(''))).to.be.true;
    });
  });

  describe('checkMatch', () => {
    it('should return an array with objects with match data', () => {
      var grid = [
        ['~', '~', '~', '~', '~'],
        ['~', '~', '~', '~', '~'],
        ['~', 'C', 'A', 'R', '~'],
        ['~', '~', '~', '~', '~'],
        ['~', '~', '~', '~', '~']
      ];

      var data = cwService.checkMatch('CAT', grid, 'vertical');

      expect(data === [{
        row: 2,
        col: 1,
        wordLetterIndex: 0
      }, {
        row: 2,
        col: 2,
        wordLetterIndex: 1
      }]);
    });
  });

  describe('fillWordVertically', () => {
    it('should fill a word to the grid vertically', () => {
      var grid = [
        ['~', '~', '~', '~', '~'],
        ['~', '~', '~', '~', '~'],
        ['~', 'C', 'A', 'R', '~'],
        ['~', '~', '~', '~', '~'],
        ['~', '~', '~', '~', '~']
      ];

      var data = {
        row: 2,
        col: 1,
        wordLetterIndex: 0
      };
      cwService.fillWordVertically('CAT', data, grid);

      expect(grid === [
        ['~', '~', '~', '~', '~'],
        ['~', '~', '~', '~', '~'],
        ['~', 'C', 'A', 'R', '~'],
        ['~', 'A', '~', '~', '~'],
        ['~', 'T', '~', '~', '~']
      ]);
    });
  });

  describe('trimGrid', () => {
    it('should trim all empty rows and columns', () => {
      var grid = [
        ['~', '~', '~', '~', '~'],
        ['~', '~', '~', '~', '~'],
        ['~', 'C', 'A', 'R', '~'],
        ['~', '~', '~', '~', '~'],
        ['~', '~', '~', '~', '~']
      ];

      var trimmedGrid = cwService.trimGrid(grid);

      expect(trimmedGrid === [
        ['C', 'A', 'R']
      ]);
    });
  });

});
