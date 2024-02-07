let TARGET_WORD = "apple";
let ROWS = []
let GAME_MODE = 5  // play game with x letter words

let guessNumber = 0;

function submitGuess() {
    const guessInput = document.getElementById("guess");
    const guess = guessInput.value.trim().toUpperCase();

    if (guess.length !== GAME_MODE || !/^[A-Z]+$/.test(guess)) {
        showToast(`Please enter a ${GAME_MODE}-letter word containing only alphabets.`);
        return;
    }

    let currentRow = ROWS[guessNumber]
    const cells = currentRow.childNodes;
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.innerText = guess[i];
        cell.style.backgroundColor = getCellColor(guess[i], i);
    }

    guessInput.value = "";

    if (guess === TARGET_WORD) {
        showToast(`Congratulations! You guessed the word.`)
    } else if (guessNumber.length === 6) {
        showToast(`You've used all your guesses. The word was: ${TARGET_WORD}`)
    }
    
    guessNumber++
}

function getCellColor(letter, position) {
    if (letter === TARGET_WORD[position].toUpperCase()) {
        return "#5cb85c"; // Dark green
    } else if (TARGET_WORD.toUpperCase().includes(letter)) {
        return "#f0ad4e"; // Dark yellow
    } else {
        return "#d9534f"; // Light red
    }
}

function clearGrid(grid) {
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
}

function populateGrid(columns = 5, rows = 6) {
    let grid =  document.getElementById("grid-container")
    clearGrid(grid)
    for (let i = 0; i < rows; i++) {
        let row = document.createElement("div")
        row.classList.add("guess-row")
        grid.append(row)
        ROWS.push(row)
        for (let j = 0; j < columns; j++) {
            let cell = document.createElement("div");
            cell.classList.add("guess-cell")
            row.append(cell)
        }
    }
}

function startNewGame(columns = 5, rows = 6) {
    ROWS = []
    GAME_MODE = columns
    guessNumber = 0;
    populateGrid(columns, rows)
    TARGET_WORD = generateRandomWord(GAME_MODE)

    const inputField = document.getElementById("guess");
    inputField.maxLength = GAME_MODE;
}

// TODO
function generateRandomWord(wordLength) {
    switch(wordLength) {
        case 3:
            return "cat"
        case 4:
            return "bear"
        case 5:
            return "apple"
        case 6:
            return "jacket"
        case 7:
            return "penguin"
    }
}

// TODO
function revealOptimalWord() {
    let optimalWord = "Apple"
    let expectedInformation = 3.14

    showToast(`Optimal word: ${optimalWord} \nExpected Information: ${expectedInformation}`)
}

function showToast(message) {
    Toastify({
        text: message,
        duration: 5000, // Duration in milliseconds
        gravity: "top", // toast position
        position: 'right', // toast position
      }).showToast();
}

startNewGame()