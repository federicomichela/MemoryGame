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
}

/*
 * Show home page section (hide all the others)
 */
function showHome() {
		document.getElementById("homeSection").style.display = "flex";
		document.getElementById("gameSection").style.display = "none";
		document.getElementById("gameResultSection").style.display = "none";

		addHomeListeners();
		removeGameListeners();
}

/*
 * Show game section (hide all the others)
 */
function showGame() {
		document.getElementById("homeSection").style.display = "none";
		document.getElementById("gameSection").style.display = "flex";
		document.getElementById("gameResultSection").style.display = "none";

		removeHomeListeners();
		addGameListeners();
}

/*
 * Show game result section (hide all the others)
 */
function showGameResult() {
		document.getElementById("homeSection").style.display = "none";
		document.getElementById("gameSection").style.display = "none";
		document.getElementById("gameResultSection").style.display = "flex";

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
	span.innerText = String.fromCharCode(symbol);

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
	else if (event.target.parentElement.classList.contains("card_covered")) {
		target = event.target.parent;
		action = "uncover";
	}
	else if (event.target.classList.contains("card_uncovered")) {
		target = event.target;
		action = "cover";
	}
	else if (event.target.parentElement.classList.contains("card_uncovered")) {
		target = event.target.parent;
		action = "cover";
	}

	if (target) {
		target.classList.toggle("card_covered");
		target.classList.toggle("card_uncovered");
		gameMatch[action](target.dataset.row, target.dataset.col);
	}
}

/*
 * Listen to a click event on each card in the grid in order to flip the card
 */
function addGameListeners() {
	// TODO: add listener to card click
	document.getElementById("gameGrid").addEventListener("click", flipCard);
}

/*
 * Stop listening to the interactions on the cards
 */
function removeGameListeners() {
	// TODO: remove listener to card click
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
