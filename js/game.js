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
    this._symbolsInUse= [];

    this.initGrid();
  }

  initGrid() {
    // pick symbols
    for (let symbol, i=0; i<this._numberOfSymbols; i++) {
      // make sure we don't use the same symbol for multiple couples
      do {
        symbol = getRandomInt(RUNES_UNICODES.start, RUNES_UNICODES.end+1);
      } while (this._symbolsInUse.indexOf(symbol) > -1);

      this._symbolsInUse.push(symbol);
      this._gameGrid.push(symbol, symbol);
    }

    // shuffle grid
    this._gameGrid.shuffle();

    // add grid into the DOM
    this._drawGrid();
  }

  /**
   * Create DOM elements for each card in the grid.
   * NOTE: the cards have to be covered at the beginning.
   *
   * @private
   */
  _drawGrid() {
    console.log("drawing grid...");
  }

  flip() {
    console.log("flipping card");
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
}
