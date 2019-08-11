class MemoryGame {
	constructor (level) {
		this._level = level || "easy";
		this._numberOfPairs = (Math.pow(GAME_LEVELS[this._level], 2) / 2);
		this._gridRows = GAME_LEVELS[this._level];
		this._gridCols = GAME_LEVELS[this._level];
		this._gameGrid = [];
		this._startTime = new Date();
		this._stopTime = null;
		this._moves = 0;
		this._starRating = MAX_STARS;
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

		for (let i=0; i<gridSymbols.length; i+=this._gridCols) {
				let rowSymbols = gridSymbols.slice(i, i+this._gridCols);

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

				if (this._gameCompleted()) {
					this._endGame();

					result.completed = true;
					result.totalTime = this.getElapsedTime();
					result.starRating = this._starRating;
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
		this._moves++;
		this._starRating = (this._moves * MAX_STARS) / this._numberOfPairs;

		if (matchFound)
		{
			this._uncoveredSymbols.push(symbol);
		}
	}

	_gameCompleted() {
		return this._uncoveredSymbols.length === this._numberOfPairs;
	}

	_endGame() {
		this._stopTime = new Date();
	}

	getGridSize() {
		return { "rows": this._gridRows, "cols": this._gridCols };
	}

	getGridSymbols() {
		return this._gameGrid;
	}

	getSymbol(row, col) {
		return this._gameGrid[row][col];
	}

	getElapsedTime() {
		let endTime = this._stopTime ? this._stopTime : new Date();
		let msElapsed = endTime - this._startTime;
		let formattedElapsedTime = formatTimeToString(msElapsed);

		return formattedElapsedTime;
	}
}
