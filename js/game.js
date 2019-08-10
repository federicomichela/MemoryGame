const GAME_LEVELS = {
  "easy": 2,
  "medium": 4,
  "hard": 8
};
const RUNES_UNICODES = {
  "start": 5792,
  "end": 5873
};

class MemoryGame {
  constructor (level) {
    this._level = level || "easy";
    this._timeElapsed = 0;
    this._numberOfSymbols = (Math.pow(GAME_LEVELS[this._level], 2) / 2);
    this._gameGrid = [];
    this._gridRows = GAME_LEVELS[this._level];
    this._gridCols = GAME_LEVELS[this._level];

    this.initGrid();
  }

  initGrid() {
    let symbolsInUse = [];
    let gridSymbols = []

    // pick symbols
    for (let symbol, i=0; i<this._numberOfSymbols; i++) {
      // make sure we don't use the same symbol for multiple couples
      do {
        symbol = getRandomInt(RUNES_UNICODES.start, RUNES_UNICODES.end+1);
      } while (symbolsInUse.indexOf(symbol) > -1);

      symbolsInUse.push(symbol);
      gridSymbols.push(symbol, symbol);
    }

    // shuffle grid
    gridSymbols.shuffle();

    for (let i=0; i<gridSymbols.length; i+=this._gridCols) {
        let rowSymbols = gridSymbols.slice(i, i+this._gridCols);

        this._gameGrid.push(rowSymbols);
    }
  }

  cover(row, col) {
    console.log(`covering card [${row}, ${col}]`);
  }

  uncover(row, col) {
    console.log(`uncovering card [${row}, ${col}]`);
  }

  matchingPair() {
    console.log("checking if uncovered matching pair");
  }

  resetPair() {
    console.log("cover unmatching pair");
  }

  gameCompleted() {
    console.log("checking if all cards have been flipped");
  }

  endGame() {
    console.log("game completed");
  }

  getGridSize() {
    return { "rows": this._gridRows, "cols": this._gridCols };
  }

  getGridSymbols() {
    return this._gameGrid;
  }
}
