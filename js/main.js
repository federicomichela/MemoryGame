let gameMatch;

/*
 * Method to resize the game pages to match the whole window resize
 */

function resizeSections() {
	let sections = document.getElementsByClassName("flexi-section");
	let style = `width: ${window.innerWidth}px; height: ${window.innerHeight}px;`;

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
	document.getElementById("gameResultSection").classList.add("hidden");

	addHomeListeners();
	removeGameListeners();
}

/*
 * Show game section (hide all the others)
 */
function showGame() {
	document.getElementById("homeSection").classList.add("hidden");
	document.getElementById("gameSection").classList.remove("hidden");
	document.getElementById("gameResultSection").classList.add("hidden");

	removeHomeListeners();
	addGameListeners();
}

/*
 * Show game result section (hide all the others)
 */
function showGameResult() {
	document.getElementById("homeSection").classList.add("hidden");
	document.getElementById("gameSection").classList.add("hidden");
	document.getElementById("gameResultSection").classList.remove("hidden");

	removeHomeListeners();
	removeGameListeners();
}

/*
 * Helper method: creates a card element in the DOM which contains a card-symbol span
 */
function createCard(width, height, symbol, row, col) {
	let styleText = `width: ${width}px; height: ${height}px;`;
	let cardContainer = document.createElement("div");
	let card = document.createElement("div");
	let span = document.createElement("span");

	span.classList.add("card-symbol");
	card.classList.add("card", "card_covered");

	card.dataset.row = row;
	card.dataset.col = col;

	card.appendChild(span);

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
	let gridSymbols = gameMatch.getGridSymbols();

	container.innerHTML = "";

	// create the grid of cards
	for (let row=0; row<gridSize.rows; row++)
	{
		let gridRow = document.createElement("div");
	  gridRow.classList.add("row");

	  for (let col=0; col<gridSize.cols; col++)
	  {
			let card = createCard(cellWidth, cellHeight, gridSymbols[row][col], row, col);

			gridRow.appendChild(card);
	  }

	  container.appendChild(gridRow);
	}
}

/*
 * Show the game section and start playing
 */
function startGame(event) {
	let levelSelected = document.querySelector(".btn-level.btn_selected").dataset.level;

	if (gameMatch)
	{
		delete gameMatch;
	}
	gameMatch = new MemoryGame(levelSelected);

	showGame();
	createBoard();
}

function selectLevel(event) {
	if (event.target.classList.contains("btn-level")) {
		// remove selection from currently selected button
		let currentlySelectedButton = document.querySelector(".btn-level.btn_selected");
		if (currentlySelectedButton) {
			currentlySelectedButton.classList.remove("btn_selected")
		}
		// add selection to the button that has just been clicked
		event.target.classList.add("btn_selected");
	}
}

function flipCard(event) {
	let target;
	let action;

	if (event.target.classList.contains("card_covered")) {
		target = event.target;
		action = "uncover";
	}
	else if (event.target.classList.contains("card_uncovered")) {
		if (event.target.classList.contains("card_matched")) {
			// TODO: shake effect
		} else {
			target = event.target;
			action = "cover";
		}
	}

	if (target) {
		let symbol = String.fromCharCode(gameMatch.getSymbol(target.dataset.row, target.dataset.col));

		target.querySelector(`.card-symbol`).innerText = symbol;

		target.classList.toggle("card_covered");
		target.classList.toggle("card_uncovered");

		if (action === "uncover") {
			let actionResult = gameMatch.uncover(target.dataset.row, target.dataset.col);

			removeGameListeners();
			onActionResultReceived(actionResult);
		} else {
			gameMatch.cover();
		}
	}
}

function onActionResultReceived(result) {
	switch (result.action) {
		case GAME_ACTIONS.retry:
			for (card of result.pair) {
				let cardDiv = document.querySelector(`.card[data-col="${card.col}"][data-row="${card.row}"]`);

				setTimeout( () => {
					cardDiv.classList.remove("card_uncovered");
					cardDiv.classList.add("card_covered")
					cardDiv.querySelector(".card-symbol").innerText = "";
					addGameListeners();
				}, 750 );
			}
			break;
		case GAME_ACTIONS.match:
			for (card of result.pair) {
				let cardDiv = document.querySelector(`.card[data-row="${card.row}"][data-col="${card.col}"]`);

				setTimeout( () => {
					cardDiv.classList.add("card_matched");
					addGameListeners();
				}, 750 );
			}

			if (result.completed) {
				setTimeout(() => { alert("GAME COMPLETED!"); }, 1000);
			}

			break;
		case GAME_ACTIONS.wait:
			addGameListeners();
			break;
	}
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
 * Listen to a click event on the level buttons to select it.
 * Also listen to the resume button to go back to the game without restarting it.
 */
function addHomeListeners() {
	document.getElementById("levelOptions").addEventListener("click", selectLevel);
	document.querySelector(".btn-resume").addEventListener("click", showGame);
}

/*
 * Stop listening to the interactions on the level and resume buttons.
 */
function removeHomeListeners() {
	document.getElementById("levelOptions").removeEventListener("click", selectLevel);
	document.querySelector(".btn-resume").removeEventListener("click", showGame);
}

/*
 * Listen to a click event on all the buttons in the pages
 */
function addNavigationListeners() {
	// when a start or reset button is clicked, initialise a new game with the selected level
	let newGameButtons = document.querySelectorAll(".btn-start, .btn-reset");
	for (let btn of newGameButtons) {
		btn.addEventListener("click", startGame);
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
