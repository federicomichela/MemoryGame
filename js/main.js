let gameMatch, clockID;
let sounds = {
	"gameTheme": new Audio("../audio/celticTheme.wav"),
	"pairMatch": new Audio("../audio/matchFound.wav"),
	"wrongMatch": new Audio("../audio/wrongMatch.wav"),
	"levelComplete": new Audio("../audio/levelComplete.mp3"),
}

sounds.gameTheme.loop = true;

/*
 * Method to resize the game pages to match the whole window resize
 */
function resizeSections() {
	let sections = document.getElementsByClassName("flexi-section");
	let style = `height: ${window.innerHeight}px;`;

	for (let section of sections)
	{
		section.style.cssText = style;
	}

	if (window.innerWidth >= 768 && gameMatch) {
		resizeCards();
	}
}

/*
 * Method to resize cards to fit within the grid at all times
 */
function resizeCards() {
	let gridSize = gameMatch.getGridSize();
	let grid = document.getElementById("gameGrid");
	let width = grid.offsetWidth/gridSize.cols - 2; // -2 === border width
	let height = grid.offsetHeight/gridSize.rows - 2; // -2 === border width
	let styleText = `width: ${width}px; height: ${height}px;`;

	for (let card of document.querySelectorAll(".card-container")) {
		card.style.cssText = styleText;
	}
}

/*
 * Show home page section (hide all the others)
 */
function showHome() {
	document.getElementById("homeSection").classList.remove("hidden");
	document.getElementById("gameSection").classList.add("hidden");

	if (!document.getElementById("gameResultSection").classList.contains("hidden")) {
		dismissGameResult();
	}

	addHomeListeners();
	removeGameListeners();

	sounds.gameTheme.pause();
}

/*
 * Show game section (hide all the others)
 */
function showGame() {
	document.getElementById("homeSection").classList.add("hidden");
	document.getElementById("gameSection").classList.remove("hidden");

	if (!document.getElementById("gameResultSection").classList.contains("hidden")) {
		dismissGameResult();
	}

	removeHomeListeners();
	addGameListeners();

	sounds.gameTheme.play();
}

/*
 * Show game result "dialog"
 */
function showGameResult() {
	if (!gameMatch.gameCompleted()) { return; }

	document.getElementById("gameResultSection").classList.remove("hidden");

	// to simulate a real dialog prevent page scrolling by hiding overflow
	document.querySelector("body").classList.add("full-screen");

	// update dialog with game results
	document.getElementById("gameTotalTime").innerText = `Total time: ${gameMatch.getElapsedTime()}`;

	// update stars rating
	let rating = gameMatch.getStarRating();
	let starRate = 100 / MAX_STARS;
	for (let star of document.querySelectorAll(".star")) {
		if (rating - starRate > 0) {
			star.querySelector(".star-inner").style.width = "100%";
			rating -= starRate;
		} else if (rating > 0) {
			let starPerc = (100 * rating) / starRate;
			star.querySelector(".star-inner").style.width = `${starPerc}%`;
			rating -= starRate;
		} else {
			star.querySelector(".star-inner").style.width = "0%";
		}
	}

	for (let sound in sounds) {
		sounds[sound].pause();
		sounds[sound].load();
	}
	sounds.levelComplete.play();

	disableResumeButtons();
	removeHomeListeners();
	removeGameListeners();
	addGameResultListeners();
}

/*
 * Hide game result dialog
 */
function dismissGameResult() {
	document.getElementById("gameResultSection").classList.add("hidden");

	// re-enable overflow on page
	document.querySelector("body").classList.remove("full-screen");

	removeGameResultListeners();
}

/*
 * Helper method: creates a flippable card element in the DOM
 * @param width {Number}
 * @param height {Number}
 * @param row {Number}
 * @param col {Number}
 */
function createCard(width, height, row, col) {
	let styleText = `width: ${width}px; height: ${height}px;`;
	let cardContainer = document.createElement("div");
	let card = document.createElement("div");
	let cardFront = document.createElement("div");
	let cardBack = document.createElement("div");

	cardFront.classList.add("flip-face", "flip-face-front");
	cardBack.classList.add("card-symbol", "flip-face", "flip-face-back");
	card.classList.add("card", "flip", "flip-horizontal");

	card.dataset.row = row;
	card.dataset.col = col;

	card.appendChild(cardFront);
	card.appendChild(cardBack);

	cardContainer.classList.add("card-container");
	cardContainer.style.cssText = styleText;
	cardContainer.appendChild(card);

	return cardContainer;
}

/*
 * Dynamically create grid in the DOM
 */
function createBoard() {
	let container = document.getElementById("gameGrid");
	let gridSize = gameMatch.getGridSize();
	let containerWidth = container.offsetWidth;
	let containerHeight = container.offsetHeight;
	let cellWidth = containerWidth/gridSize.cols - 2; // -2 === border width
	let cellHeight = containerHeight/gridSize.rows - 2; // -2 === border width

	// reset container content
	container.innerHTML = "";

	// reset container class
	for (let containerClass in container.classList) {
		container.classList.remove(containerClass);
	}
	container.classList.add(`game-grid--level-${gameMatch.getLevel()}`);

	// create the grid of cards
	for (let row=0; row<gridSize.rows; row++)
	{
		let gridRow = document.createElement("div");
	  gridRow.classList.add("row");

	  for (let col=0; col<gridSize.cols; col++)
	  {
			let card = createCard(cellWidth, cellHeight, row, col);

			gridRow.appendChild(card);
	  }

	  container.appendChild(gridRow);
	}
}

/*
 * Update the level and start clock in the game page
 */
function updateGameInfos() {
	clearInterval(clockID);
	clockID = setInterval(() => {
		document.getElementById("gameTimeElapsed").innerText = gameMatch.getElapsedTime();
	}, 1000);

	document.getElementById("gameLevelDescription").innerText = `Level ${GAME_LEVELS[gameMatch.getLevel()]}`;
}

/**
 * Make resume buttons available
 */
function enableResumeButtons() {
	for (let btn of document.querySelectorAll(".btn-resume")) {
		btn.classList.remove("hidden");
	}
}

/**
 * Make resume buttons unavailable
 */
function disableResumeButtons() {
	for (let btn of document.querySelectorAll(".btn-resume")) {
		btn.classList.add("hidden");
	}
}

/*
 * Start a new game on a specified level
 * @param level {Number}
 */
function initialiseGame(level) {
	gameMatch = new MemoryGame(level);

	enableResumeButtons();
	showGame();
	createBoard();
	updateGameInfos();
}

/*
 * Start a new game from the selected level
 */
function startGame() {
	let levelSelected = document.querySelector(".btn-level.selected").dataset.level;

	initialiseGame(levelSelected);

	for (let loadingElement of document.querySelectorAll(".loading")) {
		loadingElement.classList.remove("loading");
	}
}

/*
 * Start a new game from the current game level
 */
function resetGame() {
	let level = gameMatch.getLevel();

	initialiseGame(level);
}

/*
 * Reset to a new game with higher level
 */
function levelUp() {
	let nextLevel = parseInt(gameMatch.getLevel()) + 1;

	initialiseGame(nextLevel);
}

/*
 * Event callback method to select a level
 * @param event {Object}
 */
function selectLevel(event) {
	if (event.target.classList.contains("btn-level")) {
		// remove selection from currently selected button
		let currentlySelectedButton = document.querySelector(".btn-level.selected");
		if (currentlySelectedButton) {
			currentlySelectedButton.classList.remove("selected")
		}
		// add selection to the button that has just been clicked
		event.target.classList.add("selected");
	}
}

/*
 * Event callback method to flip a card
 * @param event {Object}
 */
function flipCard(event) {
	let target = event.target;
	let card;
	let action;

	if (target.classList.contains("card")) {
		card = target;
		action = "uncover";

		if (card.classList.contains("selected")) {
			if (card.classList.contains("card-matched")) {
				// TODO: match effect
			} else {
				// TODO: shake effect
				action = "cover";
			}
		}
	}

	if (card && !card.classList.contains("card-matched")) {
		let symbol = String.fromCharCode(gameMatch.getSymbol(target.dataset.row, target.dataset.col));

		target.querySelector(`.card-symbol`).innerText = symbol;

		target.classList.toggle("selected");

		if (action === "uncover") {
			let actionResult = gameMatch.uncover(target.dataset.row, target.dataset.col);

			removeGameListeners();
			onActionResultReceived(actionResult);
		} else {
			gameMatch.cover(target.dataset.row, target.dataset.col);
		}
	}
}

function matchPair(pair) {
	let card1 =  document.querySelector(`.card[data-col="${pair[0].col}"][data-row="${pair[0].row}"]`);
	let card2 =  document.querySelector(`.card[data-col="${pair[1].col}"][data-row="${pair[1].row}"]`);

	card1.classList.toggle("card-matched");
	card2.classList.toggle("card-matched");

	sounds.pairMatch.pause();
	sounds.pairMatch.load();
	sounds.pairMatch.play();

	addGameListeners();
}

function shakePair(pair) {
	let card1 =  document.querySelector(`.card[data-col="${pair[0].col}"][data-row="${pair[0].row}"]`);
	let card2 =  document.querySelector(`.card[data-col="${pair[1].col}"][data-row="${pair[1].row}"]`);

	card1.parentElement.classList.toggle("wrong-match");
	card2.parentElement.classList.toggle("wrong-match");

	sounds.wrongMatch.pause();
	sounds.wrongMatch.load();
	sounds.wrongMatch.play();
}

function coverPair(pair) {
	let card1 =  document.querySelector(`.card[data-col="${pair[0].col}"][data-row="${pair[0].row}"]`);
	let card2 =  document.querySelector(`.card[data-col="${pair[1].col}"][data-row="${pair[1].row}"]`);

	card1.classList.toggle("selected");
	card2.classList.toggle("selected");

	card1.parentElement.classList.toggle("wrong-match");
	card2.parentElement.classList.toggle("wrong-match");

	card1.querySelector(".card-symbol").innerText = "";
	card2.querySelector(".card-symbol").innerText = "";

	addGameListeners();
}

/*
 * Callback method to update the DOM based on the result returned by flipping
 * a card.
 * @param result {Object}
 */
function onActionResultReceived(result) {
	switch (result.action) {
		case GAME_ACTIONS.retry:
			setTimeout(shakePair.bind(this, result.pair), 1000);
			setTimeout(coverPair.bind(this, result.pair), 1500);
			break;
		case GAME_ACTIONS.match:
			setTimeout(matchPair.bind(this, result.pair), 750 );

			if (result.completed) {
				// stop clock on game page
				clearInterval(clockID);

				setTimeout(showGameResult, 2000);
			}

			break;
		case GAME_ACTIONS.wait:
			addGameListeners();
			break;
	}
}

/**
 * Add loading class to clicked button then show the game page
 *
 * @param {Object} event
 */
function loadGame(event) {
	event.target.classList.add("loading");
	setTimeout(startGame.bind(this, event), 1000);
}

/*
 * Listen to a click event on the level buttons to select it.
 * Also listen to the resume button to go back to the game without restarting it.
 */
function addHomeListeners() {
	document.getElementById("levelOptions").addEventListener("click", selectLevel);
	document.querySelector(".btn-resume").addEventListener("click", loadGame);
}

/*
 * Stop listening to the interactions on the level and resume buttons.
 */
function removeHomeListeners() {
	document.getElementById("levelOptions").removeEventListener("click", selectLevel);
	document.querySelector(".btn-resume").removeEventListener("click", loadGame);
}

/*
 * Listen to a click event on each card in the grid in order to flip the card
 */
function addGameListeners() {
	document.getElementById("gameGrid").addEventListener("click", flipCard);
}

/*
 * Stop listening to the interactions on the cards
 */
function removeGameListeners() {
	document.getElementById("gameGrid").removeEventListener("click", flipCard);
}

/*
 * Listen to a click even on the level up button
 */
function addGameResultListeners() {
	document.querySelector("#gameResultSection .dialog .btn-levelup").addEventListener("click", levelUp);
}


/*
 * Stop listening to the level up button click
 */
function removeGameResultListeners() {
	document.querySelector("#gameResultSection .dialog .btn-levelup").removeEventListener("click", levelUp);
}

/*
 * Listen to a click event on all the buttons in the pages
 */
function addNavigationListeners() {
	// when a start or reset button is clicked, initialise a new game with the selected level
	let startGameButtons = document.querySelectorAll(".btn-start");
	for (let btn of startGameButtons) {
		btn.addEventListener("click", loadGame);
	}

	let resetGameButtons = document.querySelectorAll(".btn-reset");
	for (let btn of resetGameButtons) {
		btn.addEventListener("click", resetGame);
	}

	// when an home button is clicked, show the home section
	let homeButtons = document.querySelectorAll(".btn-home");
	for (let btn of homeButtons) {
		btn.addEventListener("click", showHome);
	}
}

window.onresize = resizeSections;

document.addEventListener('DOMContentLoaded', (event) => {
	resizeSections();
	addNavigationListeners();
	addHomeListeners();
});
