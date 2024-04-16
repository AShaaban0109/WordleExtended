const SERVER_ADDRESS = `http://localhost:3000`    // for my local machine. 
let GAME_MODE = 5  // play game with x letter words
let TARGET_WORD = "apple";
let ROWS = []
let GUESSES = []

function startNewGame(columns = 5, rows = 6) {
    GAME_MODE = columns
    ROWS = []
    GUESSES = []
    generateRandomWord(GAME_MODE)
    populateGrid(columns, rows)

    const inputField = document.getElementById("guess");
    inputField.disabled = false;
    inputField.value = ""
    inputField.maxLength = GAME_MODE;
    inputField.addEventListener("keydown", handleEnterKeyPress);
    inputField.focus();
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

function clearGrid(grid) {
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
}

function handleEnterKeyPress(event) {
    if (event.key === "Enter") {
        submitGuess();
        document.getElementById("guess").focus();
    }
}

function showToast(message) {
    Toastify({
        text: message,
        duration: 5000, // Duration in milliseconds
        gravity: "top", // toast position
        position: 'right', // toast position
      }).showToast();
}

async function submitGuess() {
    const guessInput = document.getElementById("guess");
    const guess = guessInput.value.trim().toUpperCase();

    if (!await isAcceptableGuess(guess)) {
        return;
    }
    GUESSES.push(guess)

    let currentRow = ROWS[GUESSES.length - 1]
    const cells = currentRow.childNodes;
    let colors = []; // Store colors for each letter
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const letter = guess[i];
        cell.innerText = letter;
        const color = getCellColor(letter, i);
        cell.style.backgroundColor = color;
        colors.push(color);
    }

    // Send the guess and colors to the backend
    try {
         fetch(`${SERVER_ADDRESS}/send-guess`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                guess: guess,
                colors: colors
            })
        });
    } catch (error) {
        console.error('Error:', error);
    }

    if (guess === TARGET_WORD.toUpperCase()) {
        showToast(`Congratulations! You guessed the word.`)
        guessInput.disabled = true;
    } else if (GUESSES.length === 6) {
        showToast(`You've used all your guesses. The word was: ${TARGET_WORD}`)
        guessInput.disabled = true;
    }
    
    guessInput.value = "";
    document.getElementById("guess").focus();

}

async function isAcceptableGuess(guess) {
    if (guess.length !== GAME_MODE && !/^[A-Z]+$/.test(guess)) {
        showToast(`Please enter a ${GAME_MODE}-letter word containing only alphabets.`);
        return false
    } else if (guess.length !== GAME_MODE) {
        showToast(`Please enter a ${GAME_MODE}-letter word.`);
        return false
    } else if (!/^[A-Z]+$/.test(guess)) {
        showToast(`Please enter a word containing only alphabets.`);
        return false
    } else if (GUESSES.includes(guess)) {
        showToast(`Please enter a word which was not previously guessed.`);
        return false
    } else if (!await isRealWord(guess)) {
        showToast(`Please enter a real word.`);
        return false
    } else {
        return true
    }
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

async function generateRandomWord(wordLength) {
        // Make a request to the server
        fetch(`${SERVER_ADDRESS}/random-word?wordLength=${wordLength}`)
        .then(response => response.text())
        .then(data => {
            TARGET_WORD = data
            console.log(TARGET_WORD);
        })
        .catch(error => console.error(error));
}

async function isRealWord(guess) {
    try {
        const response = await fetch(`${SERVER_ADDRESS}/check-word?word=${guess}`);
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function revealOptimalWord() {
    let optimalWord = ''
    let expectedInformation = 0
    // Make a request to the server
    fetch(`${SERVER_ADDRESS}/get-optimal-word`)
    .then(response => response.json())
    .then(data => {
        optimalWord = data.optimalWord
        expectedInformation = data.expectedInformation
        expectedInformation = expectedInformation.toFixed(2);
        showToast(`Optimal next word: ${optimalWord} \nExpected Information: ${expectedInformation}`);
        console.log((`Optimal next word: ${optimalWord} \nExpected Information: ${expectedInformation}`));

    })
    .catch(error => console.error(error));
}

// function revealOptimalWord() {
//     let optimalWord = "Apple";

//     // Send the current word to the backend
//     fetch('http://localhost:3000/process-word', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ word: optimalWord })
//     })
//     .then(response => response.json())
//     .then(data => {
//         // Processed information received from the backend
//         const expectedInformation = data.expectedInformation;
//         showToast(`Optimal next word: ${optimalWord} \nExpected Information: ${expectedInformation}`);
//         document.getElementById("guess").focus();
//     })
//     .catch(error => console.error('Error:', error));
// }


startNewGame()