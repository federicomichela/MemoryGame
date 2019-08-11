class MemoryGame {
	constructor (level) {
		level = level.toString();

		this._level = Object.keys(GAME_LEVELS).indexOf(level) > -1 ? level : "0";
		this._gridSize = GRID_SIZE_BY_LEVEL[GAME_LEVELS[this._level]];
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

	cover() {
		this._onMatchUncovered(false);
	}

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

	_matchingPair() {
		return this._pair[0].symbol === this._pair[1].symbol;
	}

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

	_endGame() {
		this._stopTime = new Date();
	}

	gameCompleted() {
		return this._uncoveredSymbols.length === this._numberOfPairs;
	}

	getGridSize() {
		return { "rows": this._gridSize, "cols": this._gridSize };
	}

	getGridSymbols() {
		return this._gameGrid;
	}

	getSymbol(row, col) {
		return this._gameGrid[row][col];
	}

	getLevel() {
		return this._level;
	}

	getElapsedTime() {
		let endTime = this._stopTime ? this._stopTime : new Date();
		let msElapsed = endTime - this._startTime;
		let formattedElapsedTime = formatTimeToString(msElapsed);

		return formattedElapsedTime;
	}

	getStarRating() {
		return this._starRating;
	}
}
