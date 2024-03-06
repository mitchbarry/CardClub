import { useEffect, useState, useRef } from "react";

import homeButton from "../assets/homeButton.png"
import pokerTime from "../assets/pokerLogo.png"
import styles from "../css/Poker.module.css";

const Poker = () => {

    const canvasRef = useRef(null);

    const [ctx, setCtx] = useState(null);
    const [mousePos, setMousePos] = useState({ x: null, y: null });
    const [gameState, setGameState] = useState({
        state: 0,
        playerCount: 5,
        difficulty: 0,
        deck: [],
        river: [],
        pot: 0,
        players: [],
        highestBet: 0,
        playersFolded: 0,
        winners: []
        });

    const interactables = {
        foldButton: {
            buttonX: 550, buttonY: 938, buttonWidth: 150, buttonHeight: 50
        },
        checkButton: {
            buttonX: 775, buttonY: 938, buttonWidth: 150, buttonHeight: 50
        },
        raiseButton: {
            buttonX: 1000, buttonY: 938, buttonWidth: 150, buttonHeight: 50
        }};

    const unabbreviate = (abbreviatedWord) => {
        switch(abbreviatedWord) {
            case 11:
                return "Jack";
            case 12:
                return "Queen";
            case 13:
                return "King";
            case 14:
                return "Ace";
            case "d":
                return "Diamonds";
            case "s":
                return "Spades";
            case "h":
                return "Hearts";
            case "c":
                return "Clubs";
            default:
                return abbreviatedWord;
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        setCtx(context);
        // Add event listeners for mouse movement and clicks
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleCanvasClick);
        return () => {
            // Cleanup: remove event listeners when the component unmounts
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('click', handleCanvasClick);
        };
    }, [gameState.state]);

    const handleMouseMove = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMousePos({ x, y });
    };

    const handleCanvasClick = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (gameState.state === 4) {
            // Iterate over each interactable element
            Object.keys(interactables).forEach((key) => {
                const { buttonX, buttonY, buttonWidth, buttonHeight } = interactables[key];
                // Check if the click occurred within the boundaries of the current element
                if (x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight) {
                    // Perform actions based on the clicked element
                    switch (key) {
                        case 'foldButton':
                            playerFold();
                            break;
                        case 'checkButton':
                            playerCheck();
                            break;
                        case 'raiseButton':
                            playerRaise();
                            break;
                        default:
                            break;
                    }
                }
            })
        }
    };

    const drawElements = () => {
        if (ctx) {
            // Clear canvas
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            // Set Base Settings
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Conditionally Draw Elements
            if (gameState.state >= 2) {
                drawPlayers();
                drawPot();
                drawDeck();
            }
            if (gameState.state === 4) {
                drawPlayerButtons();
            }
            if (gameState.river.length !== 0) {
                drawRiver();
            }
            drawMouseIndicator();
        }
    };

    const drawMouseIndicator = () => {
        // Draw mouse position indicator
        if (mousePos.x !== null && mousePos.y !== null) {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(mousePos.x, mousePos.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    };

    const drawPlayers = () => {
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const radius = centerY / (7/6);
        const numPlayers = gameState.players.length;
        const angleIncrement = (Math.PI) / (numPlayers - 1);
        for (let i = 0; i < numPlayers; i++) {
            const angle = [(i + 3) % numPlayers] * angleIncrement;
            const x = centerX + (1.3 * radius) * Math.sin(angle - (Math.PI / 2));
            const y = centerY + radius * Math.cos(angle - (Math.PI / 2));
            drawPlayer(x, y, numPlayers - (i + 1), gameState.players.findIndex(player => player.dealer));
            if (gameState.state >= 3) {
                drawHand(x, y, gameState.players[numPlayers - (i + 1)]);
            }
        }
    }

    const drawPlayer = (x, y, playerIndex, dealerIndex) => {
        // Set font style
        ctx.font = '20px Arial';
        // Draw current Bet
        ctx.fillStyle = 'whitesmoke';
        ctx.fillText('Current Bet: ' + gameState.players[playerIndex].currentBet, x, y - 10);
        // Draw chip count
        ctx.fillStyle = 'whitesmoke';
        ctx.fillText('Chips: ' + gameState.players[playerIndex].chips, x, y - 40);
        // Draw player name
        ctx.fillStyle = 'black';
        ctx.fillText(gameState.players[playerIndex].name, x, y - 70);
        // Draw dealer status
        const numPlayers = gameState.players.length;
        const smallBlindIndex = (dealerIndex + 1) % numPlayers;
        const bigBlindIndex = (dealerIndex + 2) % numPlayers;
        if (playerIndex === dealerIndex) {
            ctx.fillStyle = 'yellow';
            ctx.fillText('Dealer', x, y - 100);
        }
        else if (playerIndex === bigBlindIndex) {
            ctx.fillStyle = 'yellow';
            ctx.fillText('Big Blind', x, y - 100);
        }
        else if (playerIndex === smallBlindIndex) {
            ctx.fillStyle = 'yellow';
            ctx.fillText('Small Blind', x, y - 100);
        }
        // Draw Last Action
        ctx.fillStyle = 'whitesmoke';
        ctx.fillText(gameState.players[playerIndex].lastAction, x, y - 130);
    };

    const drawHand = (x, y, player) => {
        for (let i = 0; i < player.hand.length; i++) {
            // Set font style
            ctx.font = '24px Arial';
            ctx.fillStyle ='black';
            if (player.name !== "User Player") {
                ctx.fillText("unknown", x, y - ((i * 30) + 160));
            }
            else {
                ctx.fillStyle = player.hand[i].suit === "d" || player.hand[i].suit === "h" ? 'red' : 'black';
                ctx.fillText(unabbreviate(player.hand[i].number) + " of " + unabbreviate(player.hand[i].suit), x, y - ((i * 30) + 160));
            }
        }
    }
    
    const drawPot = () => {
        const centerX = ctx.canvas.width / 2;
        // Set font style
        ctx.font = '24px Arial';
        ctx.fillStyle = 'whitesmoke';
        ctx.fillText('Pot: ' + gameState.pot, centerX, 200);
        ctx.fillText('Highest Bet: ' + gameState.highestBet, centerX, 170);
    }

    const drawDeck = () => {
        const centerX = ctx.canvas.width / 2;
        // Set font style
        ctx.font = '24px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Deck: ' + gameState.deck.length + " cards", centerX, 230);
    }

    const drawPlayerButtons = () => {
        const userPlayerIndex = gameState.players.findIndex(player => player.name === "User Player");
        const player = gameState.players[userPlayerIndex]
        ctx.font = '20px Arial';
        // Draw the button backgrounds
        // Fold Button
        ctx.fillStyle = 'gray';
        ctx.fillRect(interactables.foldButton.buttonX, interactables.foldButton.buttonY, interactables.foldButton.buttonWidth, interactables.foldButton.buttonHeight);
        ctx.fillStyle = 'whitesmoke';
        ctx.fillText("Fold", interactables.foldButton.buttonX + (interactables.foldButton.buttonWidth / 2), interactables.foldButton.buttonY + (interactables.foldButton.buttonHeight / 2));
        // Check Button
        ctx.fillStyle = 'gray';
        ctx.fillRect(interactables.checkButton.buttonX, interactables.checkButton.buttonY, interactables.checkButton.buttonWidth, interactables.checkButton.buttonHeight);
        ctx.fillStyle = 'whitesmoke';
        ctx.fillText(player.currentBet === gameState.highestBet ? "Check" : `Call (${gameState.highestBet - player.currentBet})`, interactables.checkButton.buttonX + (interactables.checkButton.buttonWidth / 2), interactables.checkButton.buttonY + (interactables.checkButton.buttonHeight / 2));
        // Raise Button
        ctx.fillStyle = 'gray';
        ctx.fillRect(interactables.raiseButton.buttonX, interactables.raiseButton.buttonY, interactables.raiseButton.buttonWidth, interactables.raiseButton.buttonHeight);
        ctx.fillStyle = 'whitesmoke';
        ctx.fillText("Raise (10)", interactables.raiseButton.buttonX + (interactables.raiseButton.buttonWidth / 2), interactables.raiseButton.buttonY + (interactables.raiseButton.buttonHeight / 2));
    }

    const drawRiver = () => {
        const centerX = ctx.canvas.width / 2;
        for (let i = 0; i < gameState.river.length; i++) {
            ctx.font = '24px Arial';
            ctx.fillStyle = gameState.river[i].suit === "d" || gameState.river[i].suit === "h" ? 'red' : 'black';
            ctx.fillText(unabbreviate(gameState.river[i].number) + " of " + unabbreviate(gameState.river[i].suit), centerX - 350 + (i * 175), 450);
        }
    }

    useEffect(() => {
        drawElements();
    }, [ctx, mousePos, gameState.state]);

    /* Track defcon States Here
        0 - Menu
        1 - Choose Difficulty -> players get created
        2 - difficulty selected, deck gets shuffled .. otherwise preparing game.. click to continue -> 
        3 - game start blinds are collected + cards are dealt
        4 - player choice on the first round -> pause player choice cycle
        5 - begin player choice cycle starting left of big blind
        6 - begin player choice cycle starting left of player
        7 - begin player choice cycle starting left of dealer
        8 - river comes out -> move to defcon 9
        9 - turn comes out -> move to defcon 9
        10 - remaining player's lastActions are reset to "" -> move to defcon 7 to resolve
        11 - a winner is decided based either gameState.winner, or by best hand.
        12 - round cleanup,  pot is dealt back to the winner, player's hands are reset, river is reset
        13 - click to continue... -> back to defcon 2
    */

    const buttonHandler = (e) => {
        switch(e.target.id) {
            case "play":
                console.log("<-- loading game...")
                console.log("--> select difficulty...")
                setGameState(prevState => ({ ...prevState, state: 1 }));
                break;
            case "home":
                console.log("<-- returning home...")
                console.log("<-- resetting game...")
                setGameState(prevState => ({ ...prevState, state: 0 }));
                break;
            case "easy":
                console.log("<-- easy difficulty selected...");
                console.log("--> click anywhere to begin...");
                setGameState(prevState => ({ ...prevState, difficulty: 0, state: 2 }));
                break;
            case "medium":
                console.log("<-- medium difficulty selected...");
                console.log("--> click anywhere to begin...");
                setGameState(prevState => ({ ...prevState, difficulty: 1, state: 2 }));
                break;
            case "hard":
                console.log("<-- hard difficulty selected...");
                console.log("--> click anywhere to begin...");
                setGameState(prevState => ({ ...prevState, difficulty: 2, state: 2 }));
                break;
            case "start":
                console.log("<-- shuffling deck...");
                console.log("<-- beginning player cycle...");
                setGameState(prevState => ({ ...prevState, state: 3}));
                break;
            default:
                return;
        }
    }

    useEffect(() => {
        switch(gameState.state) {
            case 0:
                setGameState(prevState => ({ ...prevState, difficulty: 0, deck: [], river: [], pot: 0, players: []}));
                break;
            case 1:
                setGameState(prevState => ({ ...prevState, players: generatePlayers()}));
                break;
            case 2:
                setGameState(prevState => ({ ...prevState,  deck: shuffleDeck()}));
                break;
            case 3:
                collectBlindsAndDeal();
                break;
            case 4:
                console.log(`--> User Player is deciding...`);
                break;
            case 5:
            case 6:
            case 7:
                runGame();
                break;
            case 8:
                initialFlop();
                break;
            case 9:
                turn();
                break;
            case 10:
                roundReset();
                break;
            case 11:
                determineWinner();
                break;
            case 12:
                resolveGame();
                break;
            case 13:
                playAgain();
                break;
            default:
                return;
        }
    }, [gameState.state]);

    const shuffleDeck = () => {
        const newDeck = [
            { number: 2, suit: 'h' }, { number: 3, suit: 'h' }, { number: 4, suit: 'h' }, { number: 5, suit: 'h' },
            { number: 6, suit: 'h' }, { number: 7, suit: 'h' }, { number: 8, suit: 'h' }, { number: 9, suit: 'h' },
            { number: 10, suit: 'h' }, { number: 11, suit: 'h' }, { number: 12, suit: 'h' }, { number: 13, suit: 'h' },
            { number: 14, suit: 'h' }, { number: 2, suit: 'd' }, { number: 3, suit: 'd' }, { number: 4, suit: 'd' },
            { number: 5, suit: 'd' }, { number: 6, suit: 'd' }, { number: 7, suit: 'd' }, { number: 8, suit: 'd' },
            { number: 9, suit: 'd' }, { number: 10, suit: 'd' }, { number: 11, suit: 'd' }, { number: 12, suit: 'd' },
            { number: 13, suit: 'd' }, { number: 14, suit: 'd' }, { number: 2, suit: 'c' }, { number: 3, suit: 'c' },
            { number: 4, suit: 'c' }, { number: 5, suit: 'c' }, { number: 6, suit: 'c' }, { number: 7, suit: 'c' },
            { number: 8, suit: 'c' }, { number: 9, suit: 'c' }, { number: 10, suit: 'c' }, { number: 11, suit: 'c' },
            { number: 12, suit: 'c' }, { number: 13, suit: 'c' }, { number: 14, suit: 'c' }, { number: 2, suit: 's' },
            { number: 3, suit: 's' }, { number: 4, suit: 's' }, { number: 5, suit: 's' }, { number: 6, suit: 's' },
            { number: 7, suit: 's' }, { number: 8, suit: 's' }, { number: 9, suit: 's' }, { number: 10, suit: 's' },
            { number: 11, suit: 's' }, { number: 12, suit: 's' }, { number: 13, suit: 's' }, { number: 14, suit: 's' }];
        return shuffle(newDeck);
    };

    const shuffle = (list) => {
        const shuffledList = list;
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        return shuffledList;
    }

    const generatePlayers = () => {
        const playerNames = [
            "Randy", "Cassandra", "Phoebe", "Mitchell", "Emily",
            "Gabriel", "Zachary", "Adam", "Logan", "Matthew",
            "Joan", "Nicholas", "Christopher", "Ashley", "Jessica",
            "Shorukh", "Olivia", "Ethan", "Emma", "Jacob",
            "Ava", "Michael", "Isabella", "William", "Sophia",
            "Alexander", "Mia", "James", "Charlotte", "Benjamin"
        ];
        const shuffledPlayerNames = shuffle(playerNames)
        const newPlayers = []
        const dealerIndex = Math.floor(Math.random() * gameState.players.length)
        for (let i = 0; i < gameState.playerCount; i++) {
            const isDealer = i === dealerIndex;
            if (i === 0) {
                newPlayers.push({name: "User Player", chips: 1000, dealer: isDealer ? true : false, lastAction: "", hand: [], currentBet: 0})
            }
            else {
                newPlayers.push({name: shuffledPlayerNames[i], chips: 1000, dealer: isDealer ? true : false, lastAction: "", hand: [], currentBet: 0})
            }
        }
        return newPlayers;
    }

    const collectBlindsAndDeal = () => {
        const newPlayers = [...gameState.players];
        const numPlayers = newPlayers.length
        const currentDealerIndex = newPlayers.findIndex(player => player.dealer);
        const smallBlindIndex = (currentDealerIndex + 1) % numPlayers;
        const bigBlindIndex = (currentDealerIndex + 2) % numPlayers;
        newPlayers[smallBlindIndex].chips -= 5;
        newPlayers[smallBlindIndex].currentBet = 5;
        newPlayers[bigBlindIndex].chips -= 10;
        newPlayers[bigBlindIndex].currentBet = 10;
        let newDeck =  [...gameState.deck]
        for (let i = smallBlindIndex; i < (2*(numPlayers) + smallBlindIndex); i++) {
            newPlayers[i % numPlayers].hand.push(newDeck.pop());
        }
        setGameState(prevState => ({ ...prevState, state: 5, players: newPlayers, deck: newDeck, pot: 15, highestBet: 10}));
    }

    const playerFold = () => {
        console.log(`<-- User Player will fold...`);
        const newGameState = {...gameState};
        const userPlayerIndex = newGameState.players.findIndex(player => player.name === "User Player");
        newGameState.players[userPlayerIndex].lastAction = "Fold";
        newGameState.state = 6;
        newGameState.playersFolded += 1;
        setGameState(newGameState);
        console.log("<-- setting state to 6")
    }

    const playerCheck = () => {
        const newGameState = {...gameState};
        const userPlayerIndex = newGameState.players.findIndex(player => player.name === "User Player");
        let player = newGameState.players[userPlayerIndex];
        if (player.currentBet !== newGameState.highestBet) {
            const callAmount = newGameState.highestBet - player.currentBet
            console.log(`<-- User Player will call (${callAmount})...`);
            player.lastAction = `Call (${callAmount})`;
            player.currentBet = player.currentBet + callAmount
            player.chips = player.chips - (callAmount)
            newGameState.pot = newGameState.pot + callAmount;
        }
        else {
            console.log(`<-- User Player will check...`);
            player.lastAction = "Check";
        }
        newGameState.players[userPlayerIndex] = player
        newGameState.state = 6
        setGameState(newGameState);
        console.log("<-- setting state to 6")
    }

    const playerRaise = () => {
        const newGameState = {...gameState};
        const userPlayerIndex = newGameState.players.findIndex(player => player.name === "User Player");
        let player = newGameState.players[userPlayerIndex];
        const raiseAmount = 10;
        console.log(`<-- User Player will raise by ${raiseAmount}...`);
        player.lastAction = `Raise ${raiseAmount}`;
        if (player.currentBet !== newGameState.highestBet) {
            const callAmount = newGameState.highestBet - player.currentBet
            player.currentBet = player.currentBet + callAmount + raiseAmount
            player.chips = player.chips - (callAmount + raiseAmount)
            newGameState.pot = newGameState.pot + callAmount + raiseAmount;
            newGameState.highestBet = newGameState.highestBet + raiseAmount
        }
        else {
            player.currentBet = player.currentBet + raiseAmount
            player.chips = player.chips - raiseAmount
            newGameState.pot = newGameState.pot + raiseAmount;
            newGameState.highestBet = newGameState.highestBet + raiseAmount
        }
        newGameState.players[userPlayerIndex] = player
        newGameState.state = 6
        setGameState(newGameState);
        console.log("<-- setting state to 6")
    }

    const runGame = () => {
        const newGameState = {...gameState};
        const numPlayers = newGameState.players.length;
        const userPlayerIndex = gameState.players.findIndex(player => player.name === "User Player");
        const leftOfUserPlayerIndex = (userPlayerIndex + 1) % numPlayers
        const currentDealerIndex = newGameState.players.findIndex(player => player.dealer);
        const underTheGunIndex = (currentDealerIndex + 3) % numPlayers;
        const smallBlindIndex = (currentDealerIndex + 1) % numPlayers
        let currentIndex = 0;
        if (newGameState.state === 5) {
            currentIndex = underTheGunIndex;
        }
        if (newGameState.state === 6) {
            currentIndex = leftOfUserPlayerIndex;
        }
        if (newGameState.state === 7) {
            currentIndex = smallBlindIndex;
        }
        while (newGameState.state === 5 || newGameState.state === 6 || newGameState.state === 7) {
            let roundResolved = true;
            for (let i = 0; i < numPlayers; i++) {
                // Check if all other players have folded
                if (newGameState.playersFolded === (numPlayers - 1)) {
                    const winnerIndex = newGameState.players.findIndex(player => player.lastAction !== "Fold");
                    newGameState.winners.push({playerIndex: winnerIndex, rankedHand: {rank: 0, best5: []}});
                    console.log(`<-- All other players have folded. ${newGameState.winners[0].name} wins!`);
                    newGameState.state = 11; // Game State updates to resolve winner
                    setGameState(newGameState);
                    return;
                }
                const player = { ...newGameState.players[currentIndex % numPlayers] };
                // Check if the player needs to take an action
                if (player.lastAction === "" || (player.lastAction !== "Fold" && player.currentBet !== newGameState.highestBet)) {
                    roundResolved = false; // Set flag to false if any player needs to act
                    console.log("<-- a player is able to go...")
                    if (player.name === "User Player") {
                        // If it's the user's turn, set the game state to allow the user to make a choice
                        newGameState.state = 4;
                        setGameState(newGameState);
                        return; // Exit the function to allow the user to make a choice
                    }
                    else {
                        // Randomly decide an action for non-user players
                        const randomFactor = Math.floor(Math.random() * 4);
                        console.log(`<-- running ${player.name}'s turn...`);
                        switch (randomFactor) {
                            case 0:
                                console.log(`<-- ${player.name} folded...`);
                                player.lastAction = "Fold";
                                newGameState.playersFolded += 1;
                                break;
                            case 1:
                            case 2:
                                if (player.currentBet !== newGameState.highestBet) {
                                    const callAmount = newGameState.highestBet - player.currentBet;
                                    console.log(`<-- ${player.name} will call (${callAmount})...`);
                                    player.lastAction = `Call (${callAmount})`;
                                    player.currentBet += callAmount;
                                    player.chips -= callAmount;
                                    newGameState.pot += callAmount;
                                } else {
                                    console.log(`<-- ${player.name} will check...`);
                                    player.lastAction = "Check";
                                }
                                break;
                            case 3:
                                const raiseAmount = Math.floor(Math.random() * 20) + 1;
                                console.log(`<-- ${player.name} will raise by ${raiseAmount}...`);
                                player.lastAction = `Raise ${raiseAmount}`;
                                if (player.currentBet !== newGameState.highestBet) {
                                    const callAmount = newGameState.highestBet - player.currentBet;
                                    player.currentBet += (callAmount + raiseAmount);
                                    player.chips -= (callAmount + raiseAmount);
                                    newGameState.pot += (callAmount + raiseAmount);
                                    newGameState.highestBet += raiseAmount;
                                } else {
                                    player.currentBet += raiseAmount;
                                    player.chips -= raiseAmount;
                                    newGameState.pot += raiseAmount;
                                    newGameState.highestBet += raiseAmount;
                                }
                                break;
                            default:
                                return;
                        }
                        // Set newGameState after deciding which random action a non-user takes
                        newGameState.players[currentIndex % numPlayers] = player;
                    }
                }
                currentIndex++;
            }
            // If all players's are resolved, move to the next stage of the game
            if (roundResolved) {
                console.log("<-- round resolved...")
                console.log("River Length: " + newGameState.river.length)
                switch(newGameState.river.length) {
                    case 0:
                        console.log("<-- initial flop...");
                        newGameState.state = 8;
                        break;
                    case 3: 
                        console.log("<-- turn...");
                        newGameState.state = 9;
                        break;
                    case 4: 
                        console.log("<-- river...");
                        newGameState.state = 9;
                        break;
                    case 5:
                        console.log("<-- determining winner...");
                        newGameState.state = 11;
                        break;
                    default:
                        return;
                }
                setGameState(newGameState);
                return;
            }
        }
    };

    const initialFlop = () => {
        let newDeck = [...gameState.deck];
        let newRiver = [];
        for (let i = 0; i < 4; i++) {
            if (i === 0) {
                newDeck.pop();
            }
            else {
                newRiver.push(newDeck.pop());
            }
        }
        setGameState(prevState => ({ ...prevState,  deck: newDeck, river: newRiver, state: 10}));
    }

    const turn = () => {
        let newDeck = [...gameState.deck];
        let newRiver = [...gameState.river];
        for (let i = 0; i < 2; i++) {
            if (i === 0) {
                newDeck.pop();
            }
            else {
                newRiver.push(newDeck.pop());
            }
        }
        setGameState(prevState => ({ ...prevState,  deck: newDeck, river: newRiver, state: 10}));
    }

    const roundReset = () => {
        const newPlayers = [...gameState.players];
        const numPlayers = gameState.players.length;
        for (let i = 0; i < numPlayers; i++) {
            if (newPlayers[i].lastAction !== "Fold") {
                newPlayers[i].lastAction = ""
            }
        }
        setGameState(prevState => ({ ...prevState, players: newPlayers, state: 7}));
    }

    const determineWinner = () => {
        const newGameState = {...gameState};
        const numPlayers = newGameState.players.length;
        if (newGameState.winners.length === 0) {
            const evaluatedHands = []; // evaluatedHands is a list of objects where {playerIndex: playerIndex in gameState.players, hand: ranking of the player's hand + cards in the river determined by evaluateHand}
            for (let i = 0; i < numPlayers; i++) { // Evaluate hands for all active players
                if (newGameState.players[i].lastAction !== "Fold") {
                    const rankedHand = evaluateHand(newGameState.players[i].hand.concat(newGameState.river));
                    evaluatedHands.push({ playerIndex: i, rankedHand: rankedHand });
                }
            }
            evaluatedHands.sort((a, b) => b.rankedHand.rank - a.rankedHand.rank); // Sort evaluated hands by rank (descending order)
            const highestRank = evaluatedHands[0].rankedHand.rank; // Identify the highest hand rank
            const newWinners = evaluatedHands.filter(hand => hand.rankedHand.rank === highestRank); // Find all players with the highest hand rank
            if (newWinners.length === 1) {
                newGameState.winners = newWinners;
            }
            else if (highestRank !== 10) {
                const finalWinners = [];
                for (let i = 0; i < newWinners.length; i++) { // This is where final winner is determined if multiple players have the same rankedHand.rank value and the rankedHand.rank is not 10(royal flush)
                    
                }
                newGameState.winners = (finalWinners);
            }
            else {
                newGameState.winners = newWinners;
            }
        }
        newGameState.state = 12;
        setGameState(newGameState);
    }

    const evaluateHand = (cards) => { // Function to evaluate the strength of a hand
        const rankedHand = {
            rank: 1,
            best5: []
        }
        cards.sort((a, b) => b.number - a.number); // Sort the cards by their numbers in descending order
        const royalFlushInfo = determineRoyalFlush(cards); // Checking for specific combinations and assign a rank
        if (royalFlushInfo !== false) {
            rankedHand.rank = 10;
            rankedHand.best5 = royalFlushInfo;
            return rankedHand;
        }
        const straightFlushInfo = determineStraightFlush(cards);
        if (straightFlushInfo !== false) {
            rankedHand.rank = 9;
            rankedHand.best5 = straightFlushInfo;
            return rankedHand;
        }
        const fourOfAKindInfo = determineFourOfAKind(cards);
        if (fourOfAKindInfo !== false) {
            rankedHand.rank = 8;
            rankedHand.best5 = fourOfAKindInfo;
            return rankedHand;
        }
        const fullHouseInfo = determineFullHouse(cards)
        if (fullHouseInfo !== false) {
            rankedHand.rank = 7;
            rankedHand.best5 = fullHouseInfo;
            return rankedHand;
        }
        const flushInfo = determineFlush(cards)
        if (flushInfo !== false) {
            rankedHand.rank = 6;
            rankedHand.best5 = flushInfo;
            return rankedHand;
        }
        const straightInfo = determineStraight(cards)
        if (straightInfo !== false) {
            rankedHand.rank = 5;
            rankedHand.best5 = straightInfo;
            return rankedHand;
        }
        const threeOfAKindInfo = determineThreeOfAKind(cards)
        if (threeOfAKindInfo !== false) {
            rankedHand.rank = 4;
            rankedHand.best5 = threeOfAKindInfo;
            return rankedHand;
        }
        const twoPairInfo = determineTwoPair(cards)
        if (twoPairInfo !== false) {
            rankedHand.rank = 3;
            rankedHand.best5 = twoPairInfo;
            return rankedHand;
        }
        const pairInfo = determinePair(cards)
        if (pairInfo !== false) {
            rankedHand.rank = 2;
            rankedHand.best5 = pairInfo;
            return rankedHand;
        }
        const highCardInfo = determineHighCard(cards)
        rankedHand.best5 = highCardInfo;
        return rankedHand;
    }

    const determineRoyalFlush = (cards) => { // Resolution functions to produce combination information
        const flush = determineFlush(cards);
        if (flush !== false) {
            if (flush[0] === 14 && flush[1] === 13 && flush[2] === 12 && flush[3] === 11 && flush[4] === 10) {
                return flush
            }
            else {
                return false;
            }
        }
    }
    
    const determineStraightFlush = (cards) => {
        const flush = determineFlush(cards);
        if (flush !== false){
            if (determineStraight(flush) !== false) {
                return flush
            }
            else {
                return false;
            }
        }
    }
    
    const determineFourOfAKind = (cards) => {
        const best5 = [];
        const cardCounts = {};
        cards.forEach(card => {
            if (!cardCounts[card.number]) {
                cardCounts[card.number] = [];
            }
            cardCounts[card.number].push(card);
        });
        for (const number of Object.values(cardCounts)) {
            if (cardCounts[number].length === 4) {
                best5.concat(cardCounts[number]);
                for (let i = cards.length - 1; i >= 0; i--) { // Adding the kicker to the best5 array
                    if (cards[i].number !== best5[0].number) {
                        best5.push(cards[i]);
                        break; // Exit the loop once the kicker is added
                    }
                }
            }
        }
        if (best5.length !== 0) {
            return best5;
        }
        else {
            return false;
        }
    }
    
    const determineFullHouse = (cards) => {
        const best5 = [];
        const cardCounts = {};
        let hasPair = false;
        let hasThreeOfAKind = false;
        cards.forEach(card => {
            if (!cardCounts[card.number]) {
                cardCounts[card.number] = [];
            }
            cardCounts[card.number].push(card);
        });
        for (const number of Object.values(cardCounts)) { // Check if there are two different card numbers with counts 3 and 2
            if (best5.length !== 5) {
                if (cardCounts[number].length === 2 && hasPair === false) {
                    best5.concat(cardCounts[number]);
                    hasPair = true;
                }
                if (cardCounts[number].length === 3 && hasThreeOfAKind === false) {
                    best5.concat(cardCounts[number]);
                    hasThreeOfAKind = true;
                }
            }
        }
        if (best5.length === 5) {
            return best5;
        }
        else {
            return false;
        }
    }
    
    const determineFlush = (cards) => {
        const best5 = [];
        const suitCards = {};
        cards.forEach(card => {
            if (!suitCards[card.suit]) {
                suitCards[card.suit] = [];
            }
            suitCards[card.suit].push(card);
        });
        for (const suit of Object.values(suitCards)) {
            if (suitCards[suit].length >= 5) {
                best5.push(...suitCards[suit].slice(0, 5));
            }
        }
        if (best5.length === 5) {
            return best5;
        }
        else {
            return false;
        }
    }

    const determineStraight = (cards) => {
        let best5 = [];
        let straightCards = [];
        for (let i = 0; i < cards.length - 1; i++) {
            straightCards.push(cards[i]);
            if (straightCards.length >= 3) {
                best5 = straightCards;
            }
            if (cards[i + 1].number - cards[i].number !== -1) { // Check if the next card forms a straight
                straightCards = []; // Reset straightCards if no straight is formed
            }
        }
        if (best5.length >= 3) { // Check if the last card of cards is part of the straight
            if (cards[cards.length - 1].number - best5[best5.length - 1].number === -1) {
                best5.push(cards[cards.length - 1]);
            }
            if (cards[0].number === 14 && best5[best5.length - 1].number === 2) { // Check if the last card of cards is part of the lowest straight [Ace,2,3,4,5]
                best5.push(cards[0]);
            }
        }
        if (best5.length >= 5) {
            best5.push(...best5.slice(0, 5));
            return best5;
        }
        return false;
    };

    const determineThreeOfAKind = (cards) => {
        const best5 = [];
        const cardCounts = {};
        cards.forEach(card => {
            if (!cardCounts[card.number]) {
                cardCounts[card.number] = [];
            }
            cardCounts[card.number].push(card);
        });
        for (const number of Object.values(cardCounts)) {
            if (cardCounts[number].length === 3) {
                best5.concat(cardCounts[number]);
                for (let i = 0; i < cards.length; i++) { // Adding the two kickers to the best5 array
                    if (!best5.map(card => card.number).includes(cards[i].number)) {
                        best5.push(cards[i]);
                        if (best5.length === 5) {
                            break; // Exit the loop once two kickers are added
                        }
                    }
                }
            }
        }
        if (best5.length === 5) {
            return best5;
        }
        else {
            return false;
        }
    }
    
    const determineTwoPair = (cards) => {
        const best5 = [];
        const cardCounts = {};
        cards.forEach(card => {
            if (!cardCounts[card.number]) {
                cardCounts[card.number] = [];
            }
            cardCounts[card.number].push(card);
        });
        for (const number of Object.values(cardCounts)) {
            if (cardCounts[number].length === 2) {
                best5.concat(cardCounts[number]);
                if (best5.length === 4) {
                    for (let i = 0; i < cards.length; i++) { // Adding the two kickers to the best5 array
                        if (!best5.map(card => card.number).includes(cards[i].number)) {
                            best5.push(cards[i]);
                            if (best5.length === 5) {
                                break; // Exit the loop once two kickers are added
                            }
                        }
                    }
                }
            }
        }
        if (best5.length === 5) {
            return best5;
        }
        else {
            return false;
        }
    }

    const determinePair = (cards) => {
        const best5 = [];
        const cardCounts = {};
        cards.forEach(card => {
            if (!cardCounts[card.number]) {
                cardCounts[card.number] = [];
            }
            cardCounts[card.number].push(card);
        });
        for (const number of Object.values(cardCounts)) {
            if (cardCounts[number].length === 2) {
                best5.concat(cardCounts[number]);
                for (let i = 0; i < cards.length; i++) { // Adding the three kickers to the best5 array
                    if (!best5.map(card => card.number).includes(cards[i].number)) {
                        best5.push(cards[i]);
                        if (best5.length === 5) {
                            break; // Exit the loop once two kickers are added
                        }
                    }
                }
            }
        }
        if (best5.length === 5) {
            return best5;
        }
        else {
            return false;
        }
    }
    
    const determineHighCard = (cards) => {
        const best5 = cards.slice(0,5);
        return best5;
    }

    const resolveGame = () => {
        const newGameState = {...gameState}
        const numWinners = newGameState.winners.length
        const numPlayers = newGameState.players.length
        const currentDealerIndex = newGameState.players.findIndex(player => player.dealer);
        const nextDealerIndex = (currentDealerIndex + 1) % newGameState.players.length;
        for (let i = 0; i < numWinners; i++) {
            const winnerIndex = newGameState.players.findIndex(player => player === newGameState.winners[i]);
            newGameState.players[winnerIndex].chips += (newGameState.pot / numWinners) // can have partial chips -> might be worth solving this later on.........
        }
        for (let i = 0; i < numPlayers; i++) {
            if (i === currentDealerIndex) {
                newGameState.players[i].dealer = false;
            }
            else if (i === nextDealerIndex) {
                newGameState.players[i].dealer = true;
            }
            newGameState.players[i].currentBet = 0
            newGameState.players[i].lastAction = ""
            newGameState.players[i].hand = []
        }
        newGameState.pot = 0;
        newGameState.river = [];
        newGameState.state = 12;
        newGameState.highestBet = 0;
        newGameState.playersFolded = 0;
        newGameState.winners = [];
        setGameState(newGameState);
    }

    const playAgain = () => {

    }

    return (
        <div className={styles.pokerContainer}>
            <div className={styles.canvasContainer}>
                <canvas className={styles.poker} ref={canvasRef} width={1700} height={1000}></canvas>
                {gameState.state !== 0 && (
                    <img src={homeButton} alt="Home Button" id="home" className={styles.homeButton} onClick={(e) => buttonHandler(e)}/>
                )}
                {gameState.state === 0 && (
                    <div className={styles.gameState0Container}>
                        <div className={styles.flexBox}>
                            <img src={pokerTime} alt="Poker Time Logo" className={styles.logo} />
                            <h1 className={styles.heading1}>
                                <span className={styles.whiteText}>
                                    Poker Time Project
                                </span>
                            </h1>
                        </div>
                        <button className={styles.playButton} id="play" onClick={(e) => buttonHandler(e)}>Play</button>
                    </div>
                )}
                {gameState.state === 1 && (
                    <div className={styles.gameState1Container}>
                        <h1 className={styles.heading3}>
                            <span className={styles.whiteText}>
                                Difficulty
                            </span>
                        </h1>
                        <div className={styles.flexBoxSpaceBetween}>
                            <button className={styles.difficultyButton} id="easy" onClick={(e) => buttonHandler(e)}>Easy</button>
                            <button className={styles.difficultyButton} id="medium" onClick={(e) => buttonHandler(e)}>Medium</button>
                            <button className={styles.difficultyButton} id="hard" onClick={(e) => buttonHandler(e)}>Hard</button>
                        </div>
                    </div>
                )}
                {gameState.state === 2 && (
                    <div className={styles.gameState2Container}>
                        <button className={styles.clickToContinueButton} id="start" onClick={(e) => buttonHandler(e)}>Click anywhere to begin...</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Poker;