import styles from "../css/Container.module.css";
import { useEffect, useState } from "react";


const Container = () => {

const [initialRender, setInitialRender] = useState(true);
const [gameRound, setGameRound] = useState(0);
const [pot, setPot] = useState(0);
const [players, setPlayers] = useState([
    {
        name: "AI",
        chips: 1000,
        hand: [],
        dealer: true
    },
    {
        name: "player",
        chips: 1000,
        hand: [],
        dealer: false
    }
]);
const [deck, setDeck] = useState([
    { number: 2, suit: 'hearts' },
    { number: 3, suit: 'hearts' },
    { number: 4, suit: 'hearts' },
    { number: 5, suit: 'hearts' },
    { number: 6, suit: 'hearts' },
    { number: 7, suit: 'hearts' },
    { number: 8, suit: 'hearts' },
    { number: 9, suit: 'hearts' },
    { number: 10, suit: 'hearts' },
    { number: 'J', suit: 'hearts' },
    { number: 'Q', suit: 'hearts' },
    { number: 'K', suit: 'hearts' },
    { number: 'A', suit: 'hearts' },
    { number: 2, suit: 'diamonds' },
    { number: 3, suit: 'diamonds' },
    { number: 4, suit: 'diamonds' },
    { number: 5, suit: 'diamonds' },
    { number: 6, suit: 'diamonds' },
    { number: 7, suit: 'diamonds' },
    { number: 8, suit: 'diamonds' },
    { number: 9, suit: 'diamonds' },
    { number: 10, suit: 'diamonds' },
    { number: 'J', suit: 'diamonds' },
    { number: 'Q', suit: 'diamonds' },
    { number: 'K', suit: 'diamonds' },
    { number: 'A', suit: 'diamonds' },
    { number: 2, suit: 'clubs' },
    { number: 3, suit: 'clubs' },
    { number: 4, suit: 'clubs' },
    { number: 5, suit: 'clubs' },
    { number: 6, suit: 'clubs' },
    { number: 7, suit: 'clubs' },
    { number: 8, suit: 'clubs' },
    { number: 9, suit: 'clubs' },
    { number: 10, suit: 'clubs' },
    { number: 'J', suit: 'clubs' },
    { number: 'Q', suit: 'clubs' },
    { number: 'K', suit: 'clubs' },
    { number: 'A', suit: 'clubs' },
    { number: 2, suit: 'spades' },
    { number: 3, suit: 'spades' },
    { number: 4, suit: 'spades' },
    { number: 5, suit: 'spades' },
    { number: 6, suit: 'spades' },
    { number: 7, suit: 'spades' },
    { number: 8, suit: 'spades' },
    { number: 9, suit: 'spades' },
    { number: 10, suit: 'spades' },
    { number: 'J', suit: 'spades' },
    { number: 'Q', suit: 'spades' },
    { number: 'K', suit: 'spades' },
    { number: 'A', suit: 'spades' }
])

const newGame = () => {
    console.log("starting game")
    shuffleDeck();
    setInitialRender(false);
    setGameRound(0);
    setPot(0)
};

const endGame = () => {
    console.log("ending game")
    changeDealer();
}

const shuffleDeck = () => {
    console.log("shuffling deck")
    const shuffledDeck = [...deck]; // Create a new array reference
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    setDeck(shuffledDeck); // Update state with the new shuffled array
};

useEffect(() => {
    if (!initialRender) {
        if (players[0].hand.length !== 0 && players[1].hand.length !== 0) {
            console.log("resetting hands")
            setPlayers(prevPlayers => (
                prevPlayers.map(player => ({
                    ...player,
                    hand: []
                }))
            ));
        }
    }
}, [deck, initialRender]);

useEffect(() => {
    if (!initialRender) {
        if (players[0].hand.length === 0 && players[1].hand.length === 0) {
            deal();
            collectBlinds();
        }
    }
}, [players, initialRender])

const deal = () => {
    console.log("dealing cards")
    const newPlayers = [...players]; // Create a copy of the players array
    for (let i = 0; i < 2*(newPlayers.length); i++) {
        if (i % 2 === 0) {
            newPlayers[0].hand.push(deck[i])
        }
        else if (i % 2 === 1) {
            newPlayers[1].hand.push(deck[i])
        }
    }
    setPlayers(newPlayers);
};

const collectBlinds = () => {
    console.log("collecting blinds")
    const newPlayers = [...players]; // Create a copy of the players array
    const currentDealerIndex = newPlayers.findIndex(player => player.dealer);
    const bigBlindIndex = (currentDealerIndex + 1) % newPlayers.length;
    const smallBlindIndex = (currentDealerIndex + 2) % newPlayers.length;
    newPlayers[bigBlindIndex].chips = newPlayers[bigBlindIndex].chips - 10
    newPlayers[smallBlindIndex].chips = newPlayers[smallBlindIndex].chips - 5
    setPot((prevPot) => prevPot + 15)
    setPlayers(newPlayers);
}

const changeDealer = () => {
    console.log("changing dealer")
    const newPlayers = [...players];
    const currentDealerIndex = newPlayers.findIndex(player => player.dealer);
    newPlayers[currentDealerIndex].dealer = false;
    const nextDealerIndex = (currentDealerIndex + 1) % newPlayers.length;
    newPlayers[nextDealerIndex].dealer = true;
    setPlayers(newPlayers);
}

const playerCheck = () => {

}

const playerRaise = () => {

}

const playerFold = () => {

}

const aiCheck = () => {

}

const aiRaise = () => {

}

const aiFold = () => {

}

    return (
        <div className={styles.container}>
            <button onClick={newGame}>Start a New Game</button>
            <h2>Dealer?: {players[1].dealer ? "yes" : "no"}</h2>
            <h3>My Chips: {players[1].chips}</h3>
            <h4>Pot: {pot}</h4>
            <ul>
                <li><b>Player Hand</b></li>
                {players[1].hand.length !== 0 && (
                    players[1].hand.map((card, index) => (
                        <li key={index}>{card.number} of {card.suit}</li>
                    ))
                )}
            </ul>
            <ul>
                <li><b>AI Hand</b></li>
                {players[0].hand.length !== 0 && (
                    players[0].hand.map((card, index) => (
                        <li key={index}>{card.number} of {card.suit}</li>
                    ))
                )}
            </ul>
            {(gameRound === 0 && !initialRender) && (
                <div>
                    <button onClick={playerCheck}>Player Check</button>
                    <button onClick={playerRaise}>Player Raise</button>
                    <button onClick={playerFold}>Player Fold</button>
                    <button onClick={aiCheck}>AI Check</button>
                    <button onClick={aiRaise}>AI Raise</button>
                    <button onClick={aiFold}>AI Fold</button>
                </div>
            )}
            <button onClick={endGame}>End Game</button>
        </div>
    )
}

export default Container;