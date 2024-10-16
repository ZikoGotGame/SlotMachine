
const prompt = require('prompt-sync')();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = { // Map creation.
    A: 2,
    B: 4,
    C: 6,
    D: 8
}

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

const deposit = () => {
    while (true){
        const depositAmount = prompt('Enter a deposit amount: ');
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log('Invalid number! Please enter a number greater than zero.');
        } else {
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while (true){
        const lines = prompt('Enter the number of lines to bet on (1-3): ');
        const numberOfLines = parseFloat(lines);
        if (isNaN(numberOfLines) || numberOfLines > 3 || numberOfLines < 1) {
            console.log('Invalid number! Please enter a number between 1 and 3 inclusive.');
        } else {
            return numberOfLines;
        }
    }
};

const getBet = (balance, numberOfLines) => {
    while (true){
        const bet = prompt('Enter the total bet: ');
        const numberBet = parseFloat(bet);
        if (isNaN(numberBet) || numberBet > balance || numberBet <= 0) {
            console.log('Invalid bet! Please enter an ammount you actually have.');
        } else {
            return numberBet / numberOfLines;
        }
    }
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) { // Iterating through a map object in js.
        for (let i = 0; i < count; ++i) {
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < COLS; ++i) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; ++j) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length); // Math.random() generates a random float value between 0 and 1.
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1); // Remove the selected symbol.
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; ++i) {
        rows.push([]);
        for (let j = 0; j < COLS; ++j) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = '';
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1){
                rowString += ' | '; 
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (bet, rows, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; ++row) {
        const symbols = rows[row];
        let allSame = true;

        for (let symbol = 0; symbol < symbols.length; ++symbol) {
            if (symbols[symbol] != symbols[symbol + 1]){
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};

const game = () => {
    let balance = deposit();

    while (true) {
        console.log('You have a balance of $' + balance);

        const numberOfLines = getNumberOfLines();
        const betPerLine = getBet(balance, numberOfLines);

        balance -= (betPerLine * numberOfLines);

        const reels = spin();
        const rows = transpose(reels);

        printRows(rows);

        const winnings = getWinnings(betPerLine, rows, numberOfLines);

        balance += winnings;

        console.log('You won $' + winnings);
        
        if (balance <= 0) {
            console.log('You ran out of money!');
            break;
        }
        const playAgain = prompt('Do you want to play again (y/n)? ');

        if (playAgain != 'y') break;
    }
};

game();
