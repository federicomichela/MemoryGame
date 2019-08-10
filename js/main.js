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

function startGame(event) {
	let levelSelected = document.querySelector(".btn-level.btn_selected").dataset.level;

	this.gameMatch = new MemoryGame(levelSelected);

	console.log(this.gameMatch);
}

function addListeners() {
	// when a level button is clicked, add the btn-selected class to mark it as selected
	document.getElementById("levelOptions").addEventListener("click", (event) => {
		// remove selection from currently selected button
		let currentlySelectedButton = document.querySelector(".btn-level.btn_selected");
		if (currentlySelectedButton) {
			currentlySelectedButton.classList.remove("btn_selected")
		}
		// add selection to the button that was just clicked
		event.target.classList.add("btn_selected");
	})

	// when a start or reset button is clicked, initialise a new game with the selected level
	let newGameButtons = document.querySelectorAll(".btn-start, .btn-reset");
	for (let btn of newGameButtons) {
		btn.addEventListener("click", startGame);
	}
}

window.onresize = resizeSections;

document.addEventListener('DOMContentLoaded', (event) => {
	let gameMatch;

	resizeSections();
	addListeners();
});
