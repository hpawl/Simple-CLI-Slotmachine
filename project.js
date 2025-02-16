// 1. Deposit some money
// 2. Determine the minimum bet amount
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the player won
// 6. Pay out the winnings
// 7. Play again

// const x = {module} (); <= makes it a function
const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2, // Keys: Values
    B: 4,
    C: 6,
    D: 8,
}

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
}

// Legacy: function x() {}
// New: const x = () => {}
const deposit = () => {
    while (true){
        const depositAmount = prompt("Enter your offering: ") // Returns str
        const numberDepositAmount = parseFloat(depositAmount); // Converts str to float

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) { // is NaN (Not a Number)
            console.log("Invalid deposit, try again.");
        } else {
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while (true){
        const lines = prompt("Enter how risky you want to be (Lines to bet on; 1-3): ") // Returns str
        const numberOfLines = parseFloat(lines); // Converts str to float

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) { 
            console.log("Invalid number of lines, try again.");
        } else {
            return numberOfLines;
        }
    }
};

const getBet = (balance, lines) => {
    while (true){
        const bet = prompt("Enter the bet per line: ") // Returns str
        const numberBet = parseFloat(bet); // Converts str to float

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) { 
            console.log("Invalid bet.");
        } else {
            return numberBet;
        }
    }
}

const spin = () => {
    const symbols = []; // Array is a reference variable, so you can add stuff even if its a const
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [] // Reels
    for (let i = 0; i < COLS; i++){
        reels.push([])
        const reelSymbols = [...symbols]; // Create a shallow copy of symbols to avoid mutating the original array.
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1) // Remove one element
        }
    }
    return reels;
}

const transpose = (reels) => {
    const rows = []

    for (let i = 0; i < ROWS; i++){
        rows.push([])
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i])
        }
    }

    return rows
}

const printRows = (rows) => {
    for (const row of rows){
        let rowString = "";
        for (const [i, symbol] of row.entries()){
            rowString += symbol // Concatonating
            if (i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString)
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    
    for (let row = 0; row < lines; row++){ // If lines is 1, only looks at index 0. If lines is 2, looks at index 0 and 1.
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) { // Goes through symbols to check if they are the same
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            } 
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[[0]]]
        }
    }  
    return winnings;
}

const game = () => {
    let balance = deposit(); // let is mutable unlike const which is immutable
    
    while (true){
        console.log("You have a balance of, $" + balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet *numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if (balance <= 0) {
            console.log("You are poor now!");
            break;
        }

        const playAgain = prompt("Keep selling your soul (y/n)? ");

        if (playAgain != "y") break;
    }
}

game();
