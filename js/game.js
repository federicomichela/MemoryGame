class MemoryGame {
	constructor (level) {
		level = level.toString();

		this._level = Object.keys(GAME_LEVELS).indexOf(level) > -1 ? level : "0";
		this._gridSize = GRID_SIZE_BY_LEVEL[this._level];
		this._numberOfPairs = (Math.pow(this._gridSize, 2) / 2);
		this._gameGrid = [];
		this._startTime = new Date();
		this._stopTime = null;
		this._wrongMoves = 0;
		this._wrongMovesThreshold = this._numberOfPairs * 2;
		this._mistakeRatingEffect = 100 / this._wrongMovesThreshold;
		this._starRating = 100;
		this._pair = [];
		this._uncoveredSymbols = [];

		this.initGrid();
	}


 /**
  * Method to create a grid of randomly picked symbols
  */
	initGrid() {
		let symbolsInUse = [];
		let gridSymbols = []

		// pick symbols
		for (let symbol, i=0; i<this._numberOfPairs; i++) {
			// make sure we don't use the same symbol for multiple couples
			do {
				symbol = getRandomInt(RUNES_UNICODES.start, RUNES_UNICODES.end+1);
			} while (symbolsInUse.indexOf(symbol) > -1);

			symbolsInUse.push(symbol);
			gridSymbols.push(symbol, symbol);
		}

		// shuffle grid
		gridSymbols.shuffle();

		for (let i=0; i<gridSymbols.length; i+=this._gridSize) {
				let rowSymbols = gridSymbols.slice(i, i+this._gridSize);

				this._gameGrid.push(rowSymbols);
		}
	}

 /**
  * Flip a card to cover it again.
  * NOTE: this action will be considered as a 'wrong move' and
  * will have impact on the star rating
  */
	cover() {
		this._onMatchUncovered(false);
	}

 /**
  * Flip a card to uncover it.
  * If a card was already uncovered, checks if the two match,
  * in which case checks if the game is completed.
  *
  * @param {type} row Description
  * @param {type} col Description
  *
  * @returns {type} Description
  */
	uncover(row, col) {
		let symbol = this._gameGrid[row][col];
		let result = { "pair": this._pair };

		this._pair.push({row, col, symbol});

		if (this._pair.length === 2) {
			if (this._matchingPair()) {
				result.action = GAME_ACTIONS.match;
				this._onMatchUncovered(true, symbol);

				if (this.gameCompleted()) {
					this._endGame();

					result.completed = true;
				}
			} else {
				result.action = GAME_ACTIONS.retry;
				this._onMatchUncovered(false);
			}
		} else {
			result.action = GAME_ACTIONS.wait;
		}

		return result;
	}

 /**
  * Method to check if the symbols of the uncovered cards match
  *
  * @returns {Boolean}
  */
	_matchingPair() {
		return this._pair[0].symbol === this._pair[1].symbol;
	}

 /**
  * Method to update the state of the game.
  * If a matching pair has been uncovered, store the uncovered symbol,
  * otherwise update the number of _wrongMoves and the _starRating
  *
  * @param {Boolean} matchFound
  * @param {Number} symbol unicode representation of a symbol character
  * @private
  */
	_onMatchUncovered(matchFound, symbol) {
		this._pair = [];

		if (matchFound) {
			this._uncoveredSymbols.push(symbol);
		} else {
			this._wrongMoves++;

			if (this._wrongMoves > this._wrongMovesThreshold) {
				this._starRating =	100 - ((this._wrongMoves - this._wrongMovesThreshold) * this._mistakeRatingEffect);
			}
		}
	}

 /**
  * Once the game is completed, saves the current time to mark the end of the game
  *
  * @private
  * @returns {type} Description
  */
	_endGame() {
		this._stopTime = new Date();
	}

 /**
  * Method to check if all the symbols pairs have been uncovered
  *
  * @returns {Boolean}
  */
	gameCompleted() {
		return this._uncoveredSymbols.length === this._numberOfPairs;
	}

 /**
  * Method to get the grid size.
	* NOTE: this method has been built with the idea that the game could support
	* custom number of rows and cols at some point
  *
  * @returns {Object}
  */
	getGridSize() {
		return { "rows": this._gridSize, "cols": this._gridSize };
	}

 /**
  * Method to get the symbol at a specific position in the grid
  *
  * @param {Number} row
  * @param {Number} col
  *
  * @returns {type} Description
  */
	getSymbol(row, col) {
		return this._gameGrid[row][col];
	}

 /**
  * Returns the level of the game
  *
  * @returns {Number} (for a list of available levels see GAME_LEVELS const)
  */
	getLevel() {
		return this._level;
	}

 /**
  * Method to get the time passed from the start of the game.
  * If the game is completed will always return the total time of the game.
  * NOTE: this method returns a nicely formatted string as "(dd::)hh:mm:ss"
  *
  * @returns {String}
  */
	getElapsedTime() {
		let endTime = this._stopTime ? this._stopTime : new Date();
		let msElapsed = endTime - this._startTime;
		let formattedElapsedTime = formatTimeToString(msElapsed);

		return formattedElapsedTime;
	}

 /**
  * Method to get the start rating of the game.
  * NOTE: the star rating is a Percentage calculated basing on the number
  * of wrong moves and the maximum number of wrong moves allowed.
  * Whenever the player exceeds the number of available wrong moves,
  * the star rating will start to decrease
  *
  * @returns {Number} Percentage of star rating
  */
	getStarRating() {
		return this._starRating;
	}
}
