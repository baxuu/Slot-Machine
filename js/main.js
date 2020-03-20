class Draw {
    constructor() {
        this.options = ["one", "two", "three"]
        let _result = this.drawResult()
        this.getDrawResult = () => _result;
    }

    drawResult() {
        let cards = [];

        for (let i = 0; i < this.options.length; i++) {
            const index = Math.floor(Math.random() * this.options.length)
            const card = this.options[index]
            cards.push(card)
        }
        return cards

    }
}

class Wallet {
    constructor(money) {
        let _money = money;
        // current money in wallet 
        this.getWalletValue = () => _money;

        // checking if user has enough money

        this.checkCanPlay = value => {
            if (_money >= value) return true;
            return false;
        }

        this.changeWallet = (value, type = "+") => {
            if (typeof value === "number" && !isNaN(value)) {
                if (type === "+") {
                    return _money += value;
                } else if (type === "-") {
                    return _money -= value;
                } else {
                    throw new Error("You cannot do that")
                }

            } else {
                console.log(typeof value);
                throw new Error("Incorrect number")
            }
        }

    }

}
class Statistics {
    constructor() {
        this.gameResults = [];

    }

    addGameToStatistics(win, bid) {
        let gameResult = {
            win,
            bid
        }

        this.gameResults.push(gameResult)
    }

    showGameStatistics() {
        let games = this.gameResults.length;
        let wins = this.gameResults.filter(result => result.win).length;
        let losses = this.gameResults.filter(result => !result.win).length

        return [games, wins, losses]
    }

}
class Result {
    static moneyWinInGame(result, bid) {
        if (result) return 3 * bid;
        else return 0;
    }

    static checkWinner(draw) {
        if (draw[0] === draw[1] && draw[1] === draw[2] || draw[0] !== draw[1] && draw[1] !== draw[2] && draw[0] !== draw[2]) return true;
        else return false
    }
}
class Game {
    constructor(start) {

        this.stats = new Statistics();
        this.wallet = new Wallet(start);

        document.getElementById('start').addEventListener('click', this.startGame.bind(this));
        document.getElementById("reset").addEventListener("click", this.resetGame.bind(this));
        this.spanWallet = document.querySelector('.panel span.wallet');
        this.boards = [...document.querySelectorAll('div.card')];
        this.inputBid = document.getElementById('bid');
        this.spanResult = document.querySelector('.score span.result');
        this.spanGames = document.querySelector('.score span.number');
        this.spanWins = document.querySelector('.score span.win');
        this.spanLosses = document.querySelector('.score span.loss');

        this.render()

    }

    render(cards = ["one", "one", "one"], money = this.wallet.getWalletValue(), result = "", stats = [0, 0, 0], bid = 0, wonMoney = 0) {


        this.boards.forEach((board, i) => {
            board.className = cards[i]
        })

        this.spanWallet.textContent = money;
        if (result) {
            result = `YOU WON ${wonMoney}$. `;
        } else if (!result && result !== "") {
            result = `YOU LOST ${bid}$. `
        }
        this.spanResult.textContent = result;
        this.spanGames.textContent = stats[0];
        this.spanWins.textContent = stats[1];
        this.spanLosses.textContent = stats[2];

        this.inputBid.value = "";
    }

    startGame() {
        if (this.inputBid.value < 1) return alert('Bet amount is to small. Minimum stake is 1$!')
        const bid = Math.floor(this.inputBid.value);

        if (!this.wallet.checkCanPlay(bid)) {
            return alert("Not enough money or incorrect value!")
        }

        this.wallet.changeWallet(bid, '-');

        this.draw = new Draw();
        const cards = this.draw.getDrawResult();
        const win = Result.checkWinner(cards);
        const wonMoney = Result.moneyWinInGame(win, bid);
        this.wallet.changeWallet(wonMoney);
        this.stats.addGameToStatistics(win, bid);

        this.render(cards, this.wallet.getWalletValue(), win, this.stats.showGameStatistics(), bid, wonMoney)


    }
    resetGame() {
        const cards = ["one", "one", "one"];
        this.render(cards);
        this.inputBid.value = "";
        this.spanWallet.textContent = "200";
        this.spanResult.textContent = "";
        this.spanGames.textContent = "0";
        this.spanWins.textContent = "0";
        this.spanLosses.textContent = "0";
    }
}





const game = new Game(200)