import { useEffect, useState, useRef } from "react";

import homeButton from "../assets/homeButton.png"
import pokerTime from "../assets/pokerLogo.png"
import styles from "../css/components/Poker.module.css";

const Poker = () => {

    const canvasRef = useRef(null);

    const [ctx, setCtx] = useState(null);
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
        canvas.addEventListener('click', handleCanvasClick); // Add event listeners for mouse movement and clicks
        return () => {
            canvas.removeEventListener('click', handleCanvasClick); // Cleanup: remove event listeners when the component unmounts
        };
    }, [gameState.state]);

    const interactables = {
        playButton: {
            buttonX: 550, buttonY: 500, buttonWidth: 150, buttonHeight: 50
        },
        homeButton: {
            buttonX: 300, buttonY: 50, buttonWidth: 60, buttonHeight: 60
        },
        easyButton: {
            buttonX: 550, buttonY: 500, buttonWidth: 150, buttonHeight: 50
        },
        mediumButton: {
            buttonX: 775, buttonY: 500, buttonWidth: 150, buttonHeight: 50
        },
        hardButton: {
            buttonX: 1000, buttonY: 500, buttonWidth: 150, buttonHeight: 50
        },
        foldButton: {
            buttonX: 550, buttonY: 938, buttonWidth: 150, buttonHeight: 50
        },
        checkButton: {
            buttonX: 775, buttonY: 938, buttonWidth: 150, buttonHeight: 50
        },
        raiseButton: {
            buttonX: 1000, buttonY: 938, buttonWidth: 150, buttonHeight: 50
        }
    };

    const handleCanvasClick = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (gameState.state === 3) {
            setGameState(prevState => ({ ...prevState, state: 4}));
        }
        if (gameState.state === 15) {
            setGameState(prevState => ({ ...prevState, state: 16}));
        }
        Object.keys(interactables).forEach((key) => {
            const { buttonX, buttonY, buttonWidth, buttonHeight } = interactables[key];
            if (x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight) {
                switch (key) { // Perform actions based on the clicked element
                    case 'playButton':
                        if (gameState.state === 0) {
                            setGameState(prevState => ({ ...prevState, state: 1 }));
                        }
                        break;
                    case 'homeButton':
                        if (gameState.state >= 1) {
                            setGameState(prevState => ({ ...prevState, state: 0}));
                        }
                        break;
                    case 'easyButton':
                        if (gameState.state === 1) {
                            setGameState(prevState => ({ ...prevState, difficulty: 0, state: 2 }));
                        }
                        break;
                    case 'mediumButton':
                        if (gameState.state === 1) {
                            setGameState(prevState => ({ ...prevState, difficulty: 1, state: 2 }));
                        }
                        break;
                    case 'hardButton':
                        if (gameState.state === 1) {
                            setGameState(prevState => ({ ...prevState, difficulty: 2, state: 2 }));
                        }
                        break;
                    case 'foldButton':
                        if (gameState.state === 7) {
                            playerFold();
                        }
                        break;
                    case 'checkButton':
                        if (gameState.state === 7) {
                            playerCheck();
                        }
                        break;
                    case 'raiseButton':
                        if (gameState.state === 7) {
                            playerRaise();
                        }
                        break;
                    default:
                        break;
                }
            }
        })
    };

    const drawElements = () => {
        if (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas
            ctx.textAlign = 'center'; // Set Base Settings
            ctx.textBaseline = 'middle';
            if (gameState.state === 0) {
                drawPlayButton();
                return;
            }
            if (gameState.state >= 1) {
                drawHomeButton();
            }
            if (gameState.state === 1) {
                drawDifficultyButtons();
                return;
            }
            if (gameState.state >= 2) { // Conditionally Draw Elements
                drawPlayers();
                drawPot();
                drawDeck();
            }
            if (gameState.river.length !== 0) {
                drawRiver();
            }
            if (gameState.state === 3 || gameState.state === 15) {
                drawContinue();
                return;
            }
            if (gameState.state === 7) {
                drawPlayerButtons();
                return;
            }
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
            if (gameState.state >= 6) {
                drawHand(x, y, gameState.players[numPlayers - (i + 1)]);
            }
        }
    }

    const drawPlayer = (x, y, playerIndex, dealerIndex) => {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'whitesmoke'; // Draw current Bet
        ctx.fillText('Current Bet: ' + gameState.players[playerIndex].currentBet, x, y - 10);
        ctx.fillStyle = 'whitesmoke'; // Draw chip count
        ctx.fillText('Chips: ' + gameState.players[playerIndex].chips, x, y - 40);
        ctx.fillStyle = 'black'; // Draw player name
        ctx.fillText(gameState.players[playerIndex].name, x, y - 70);
        const numPlayers = gameState.players.length; 
        const smallBlindIndex = (dealerIndex + 1) % numPlayers;
        const bigBlindIndex = (dealerIndex + 2) % numPlayers;
        if (playerIndex === dealerIndex) { // Draw dealer status
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
        ctx.fillStyle = 'whitesmoke'; // Draw Last Action
        ctx.fillText(gameState.players[playerIndex].lastAction, x, y - 130);
        if (gameState.state === 15) {
            for (const winner of gameState.winners) {
                if (playerIndex === winner.playerIndex) {
                    ctx.font = '26px Arial';
                    ctx.fillStyle = 'cyan';
                    ctx.fillText(`Wins!`, x + 140, y - 100);
                    ctx.fillText(`Hand Rank: ${winner.rankedHand.rank}`, x + 140, y - 70);
                    if (winner.rankedHand.best5 !== []){
                        for (let i = 0; i < winner.rankedHand.best5.length; i++) {
                            ctx.fillText(`${winner.rankedHand.best5[i].number} of ${winner.rankedHand.best5[i].suit}`, x + 140, y - 130 - (i * 30));
                        }
                    }
                }
            }
        }
    };

    const drawHand = (x, y, player) => {
        for (let i = 0; i < player.hand.length; i++) {
            ctx.font = '24px Arial';
            ctx.fillStyle ='black';
            ctx.fillStyle = player.hand[i].suit === "d" || player.hand[i].suit === "h" ? 'red' : 'black'; // THIS IS A TEMPORARY COPY OF THE ONE BELOW
            ctx.fillText(unabbreviate(player.hand[i].number) + " of " + unabbreviate(player.hand[i].suit), x, y - ((i * 30) + 160)); // THIS IS A TEMPORARY COPY OF THE ONE BELOW
            /*
            if (player.name !== "User Player") {
                ctx.fillText("unknown", x, y - ((i * 30) + 160));
            }
            else {
                ctx.fillStyle = player.hand[i].suit === "d" || player.hand[i].suit === "h" ? 'red' : 'black';
                ctx.fillText(unabbreviate(player.hand[i].number) + " of " + unabbreviate(player.hand[i].suit), x, y - ((i * 30) + 160));
            }
            */
        }
    }
    
    const drawPot = () => {
        const centerX = ctx.canvas.width / 2;
        ctx.font = '24px Arial';
        ctx.fillStyle = 'whitesmoke';
        ctx.fillText('Pot: ' + gameState.pot, centerX, 200);
        ctx.fillText('Highest Bet: ' + gameState.highestBet, centerX, 170);
    }

    const drawDeck = () => {
        const centerX = ctx.canvas.width / 2;
        ctx.font = '24px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Deck: ' + gameState.deck.length + " cards", centerX, 230);
    }

    const drawDifficultyButtons = () => {
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        ctx.globalAlpha = 0.5; // Set the transparency (alpha value)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Set the fill style to a semi-transparent color
        ctx.fillRect(centerX - centerX / 2, centerY - centerY / 2, centerX, centerY);
        ctx.globalAlpha = 1.0; // Reset the transparency for subsequent drawings
        ctx.font = '36px Arial';
        ctx.fillStyle = 'whitesmoke';
        ctx.fillStyle = 'gray'; // Easy Button
        ctx.fillRect(interactables.easyButton.buttonX, interactables.easyButton.buttonY, interactables.easyButton.buttonWidth, interactables.easyButton.buttonHeight);
        ctx.fillStyle = 'whitesmoke';
        ctx.fillText("Easy", interactables.easyButton.buttonX + (interactables.easyButton.buttonWidth / 2), interactables.easyButton.buttonY + (interactables.easyButton.buttonHeight / 2));
        ctx.fillStyle = 'gray'; // Medium Button
        ctx.fillRect(interactables.mediumButton.buttonX, interactables.mediumButton.buttonY, interactables.mediumButton.buttonWidth, interactables.mediumButton.buttonHeight);
        ctx.fillStyle = 'whitesmoke';
        ctx.fillText("Medium", interactables.mediumButton.buttonX + (interactables.mediumButton.buttonWidth / 2), interactables.mediumButton.buttonY + (interactables.mediumButton.buttonHeight / 2));
        ctx.fillStyle = 'gray'; // Hard Button
        ctx.fillRect(interactables.hardButton.buttonX, interactables.hardButton.buttonY, interactables.hardButton.buttonWidth, interactables.hardButton.buttonHeight);
        ctx.fillStyle = 'whitesmoke';
        ctx.fillText("Hard", interactables.hardButton.buttonX + (interactables.hardButton.buttonWidth / 2), interactables.hardButton.buttonY + (interactables.hardButton.buttonHeight / 2));
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

    const drawContinue = () => {
        const centerX = ctx.canvas.width / 2;
        ctx.font = '36px Arial';
        ctx.globalAlpha = 0.5; // Set the transparency (alpha value)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Set the fill style to a semi-transparent color
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Draw a rectangle covering the entire canvas
        ctx.globalAlpha = 1.0; // Reset the transparency for subsequent drawings
        ctx.fillStyle = 'whitesmoke';
        ctx.fillText("Press anywhere to continue...", centerX, 500);
    }

    const drawPlayButton = () => {
        const img = new Image();
        img.src = pokerTime;
        img.onload = function() {
            ctx.drawImage(img, 500, 500, 250, 250);
            ctx.font = '60px Arial';
            ctx.fillStyle = 'whitesmoke';
            ctx.fillText("Poker Project", 400, 600);
            ctx.font = '36px Arial';
            ctx.fillStyle = 'red'; // Play Button
            ctx.fillRect(interactables.playButton.buttonX, interactables.playButton.buttonY, interactables.playButton.buttonWidth, interactables.playButton.buttonHeight);
            ctx.fillStyle = 'whitesmoke';
            ctx.fillText("Play", interactables.playButton.buttonX + (interactables.playButton.buttonWidth / 2), interactables.playButton.buttonY + (interactables.playButton.buttonHeight / 2));
        };
    };

    const drawHomeButton = () => {
        const img = new Image();
        img.src = homeButton;
        img.onload = function() {
            ctx.drawImage(img, 300, 50, 60, 60);
        };
    }

    useEffect(() => {
        drawElements();
    }, [ctx, gameState.state]);

    /* Track game states here
        0 - Menu
        1 - Choose Difficulty...
        2 - players get created
        3 - click to begin game...
        4 - deck gets shuffled
        5 - collect blinds
        6 - deal cards
        7 - user player choice -> pause player choice cycle
        8 - begin player choice cycle starting left of big blind
        9 - begin player choice cycle starting left of user player
        10 - begin player choice cycle starting left of dealer
        11 - initial flop comes out -> move to state 13 to reset round
        12 - turn comes out -> move to state 13 to reset round
        13 - round reset -> remaining player's lastActions are reset to "" -> move to state 7 to begin resolution of a round that isn't the first (starts left of the dealer)
        14 - determine winner -> river is out and last round is resolved -> a winner is decided by best hand (this will never activate in the case that someone wins by being the last remaining)
        15 - click to continue screen -> winner can be seen with winning hand, and amount won
        16 - resolving game -> pot is distributed back to the winner(s), player's hands are reset, river is reset, winning hand is highlighted in the display -> state gets set back to 3
    */

    useEffect(() => {
        switch(gameState.state) {
            case 0:
                setGameState(prevState => ({ ...prevState, difficulty: 0, deck: [], river: [], pot: 0, players: [], highestBet: 0, playersFolded: 0, winners: []}));
                break;
            case 1:
                console.log(`--- user is deciding... ---`);
                break;
            case 2:
                console.log(`--> start phase: generate players`);
                generatePlayers();
                break;
            case 3:
                console.log(`--- User is deciding... ---`);
                break;
            case 4:
                console.log(`--> start phase: shuffle deck`);
                shuffleDeck()
                break;
            case 5:
                console.log(`--> start phase: collect blinds`);
                collectBlinds();
                break;
            case 6:
                console.log(`--> start phase: deal`);
                deal();
                break;
            case 7:
                console.log(`--- User is deciding... ---`);
                break;
            case 8:
                console.log(`--> start phase: preflop round`);
                runGame();
                break;
            case 9:
                runGame();
                break;
            case 10:
                console.log(`--> start phase: turn round`);
                runGame();
                break;
            case 11:
                console.log("--> start phase: initial flop");
                initialFlop();
                break;
            case 12:
                console.log("--> start phase: turn");
                turn();
                break;
            case 13:
                console.log("--> start phase: round cleanup");
                roundReset();
                break;
            case 14:
                console.log("--> start phase: determine winner");
                determineWinner();
                break;
            case 15:
                console.log(`--- User is deciding... ---`);
                break;
            case 16:
                console.log("--> start phase: resolve game");
                resolveGame();
                break;
            default:
                return;
        }
    }, [gameState.state]);

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
        setGameState(prevState => ({ ...prevState, players: newPlayers, state: 3}));
        console.log(`<-- stop phase: generate players`);
    }

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
        const shuffledDeck = shuffle(newDeck);
        setGameState(prevState => ({ ...prevState,  deck: shuffledDeck, state: 5}));
        console.log(`<-- stop phase: shuffle deck`);
    };

    const shuffle = (list) => {
        const shuffledList = list;
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        return shuffledList;
    }

    const collectBlinds = () => {
        const newPlayers = [...gameState.players];
        const numPlayers = newPlayers.length
        const currentDealerIndex = newPlayers.findIndex(player => player.dealer);
        const smallBlindIndex = (currentDealerIndex + 1) % numPlayers;
        const bigBlindIndex = (currentDealerIndex + 2) % numPlayers;
        const newPot = gameState.pot + 15
        newPlayers[smallBlindIndex].chips -= 5;
        newPlayers[smallBlindIndex].currentBet = 5;
        newPlayers[bigBlindIndex].chips -= 10;
        newPlayers[bigBlindIndex].currentBet = 10;
        setGameState(prevState => ({ ...prevState, state: 6, players: newPlayers, pot: newPot, highestBet: 10}));
        console.log(`<-- stop phase: collect blinds`);
    }

    const deal = () => {
        const newPlayers = [...gameState.players];
        const numPlayers = newPlayers.length
        const currentDealerIndex = newPlayers.findIndex(player => player.dealer);
        const smallBlindIndex = (currentDealerIndex + 1) % numPlayers;
        let newDeck =  [...gameState.deck]
        for (let i = smallBlindIndex; i < (2*(numPlayers) + smallBlindIndex); i++) {
            newPlayers[i % numPlayers].hand.push(newDeck.pop());
        }
        setGameState(prevState => ({ ...prevState, state: 8, players: newPlayers, deck: newDeck}));
        console.log(`<-- stop phase: deal`);
    }

    const playerFold = () => {
        const newGameState = {...gameState};
        const userPlayerIndex = newGameState.players.findIndex(player => player.name === "User Player");
        newGameState.players[userPlayerIndex].lastAction = "Fold";
        newGameState.state = 9;
        newGameState.playersFolded += 1;
        setGameState(newGameState);
    }

    const playerCheck = () => {
        const newGameState = {...gameState};
        const userPlayerIndex = newGameState.players.findIndex(player => player.name === "User Player");
        let player = newGameState.players[userPlayerIndex];
        if (player.currentBet !== newGameState.highestBet) {
            const callAmount = newGameState.highestBet - player.currentBet
            player.lastAction = `Call (${callAmount})`;
            player.currentBet = player.currentBet + callAmount
            player.chips = player.chips - (callAmount)
            newGameState.pot = newGameState.pot + callAmount;
        }
        else {
            player.lastAction = "Check";
        }
        newGameState.players[userPlayerIndex] = player
        newGameState.state = 9
        setGameState(newGameState);
    }

    const playerRaise = () => {
        const newGameState = {...gameState};
        const userPlayerIndex = newGameState.players.findIndex(player => player.name === "User Player");
        let player = newGameState.players[userPlayerIndex];
        const raiseAmount = 10;
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
        newGameState.state = 9
        setGameState(newGameState);
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
        if (newGameState.state === 8) {
            currentIndex = underTheGunIndex;
        }
        if (newGameState.state === 9) {
            currentIndex = leftOfUserPlayerIndex;
        }
        if (newGameState.state === 10) {
            currentIndex = smallBlindIndex;
        }
        while (newGameState.state === 8 || newGameState.state === 9 || newGameState.state === 10) {
            let roundResolved = true;
            for (let i = 0; i < numPlayers; i++) {
                if (newGameState.playersFolded === (numPlayers - 1)) { // Check if all other players have folded
                    const winnerIndex = newGameState.players.findIndex(player => player.lastAction !== "Fold");
                    newGameState.winners.push({playerIndex: winnerIndex, rankedHand: {rank: 0, best5: []}});
                    newGameState.state = 15; // Game State updates to resolve winner
                    setGameState(newGameState);
                    return;
                }
                const player = { ...newGameState.players[currentIndex % numPlayers] };
                if (player.lastAction === "" || (player.lastAction !== "Fold" && player.currentBet !== newGameState.highestBet)) { // Check if the player needs to take an action
                    roundResolved = false; // Set flag to false if any player needs to act
                    if (player.name === "User Player") {
                        newGameState.state = 7; // If it's the user's turn, set the game state to allow the user to make a choice
                        setGameState(newGameState);
                        return; // Exit the function to allow the user to make a choice
                    }
                    else {
                        const randomFactor = Math.floor(Math.random() * 4); // Randomly decide an action for non-user players
                        console.log(`--- measure ${player.name} ---`);
                        switch (randomFactor) {
                            case 0:
                                player.lastAction = "Fold";
                                newGameState.playersFolded += 1;
                                break;
                            case 1:
                            case 2:
                                if (player.currentBet !== newGameState.highestBet) {
                                    const callAmount = newGameState.highestBet - player.currentBet;
                                    player.lastAction = `Call (${callAmount})`;
                                    player.currentBet += callAmount;
                                    player.chips -= callAmount;
                                    newGameState.pot += callAmount;
                                } else {
                                    player.lastAction = "Check";
                                }
                                break;
                            case 3:
                                const raiseAmount = Math.floor(Math.random() * 20) + 1;
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
                        newGameState.players[currentIndex % numPlayers] = player; // Set newGameState after deciding which random action a non-user takes
                    }
                }
                currentIndex++;
            }
            if (roundResolved) { // If all players's are resolved, move to the next stage of the game
                switch(newGameState.river.length) {
                    case 0:
                        console.log(`<-- stop phase: preflop round`);
                        newGameState.state = 11;
                        break;
                    case 3:
                        console.log(`<-- stop phase: turn round`);
                        newGameState.state = 12;
                        break;
                    case 4:
                        console.log(`<-- stop phase: turn round`);
                        newGameState.state = 12;
                        break;
                    case 5:
                        newGameState.state = 14;
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
        setGameState(prevState => ({ ...prevState,  deck: newDeck, river: newRiver, state: 13}));
        console.log(`<-- stop phase: initial flop`);
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
        setGameState(prevState => ({ ...prevState,  deck: newDeck, river: newRiver, state: 13}));
        console.log(`<-- stop phase: turn`);
    }

    const roundReset = () => {
        const newPlayers = [...gameState.players];
        const numPlayers = gameState.players.length;
        for (let i = 0; i < numPlayers; i++) {
            if (newPlayers[i].lastAction !== "Fold") {
                newPlayers[i].lastAction = ""
            }
        }
        setGameState(prevState => ({ ...prevState, players: newPlayers, state: 10}));
        console.log(`<-- stop phase: round cleanup`);
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
                const finalWinners = determineFinalWinners(newWinners);
                newGameState.winners = finalWinners;
            }
            else {
                newGameState.winners = newWinners;
            }
        }
        newGameState.state = 15;
        setGameState(newGameState);
        console.log("<-- stop phase: determine winner");
    }

    const determineFinalWinners = (newWinners) => {
        let winningHand = null;
        let winningPlayers = [];
        for (const player of newWinners) {
            const currentHand = player.rankedHand.best5;
            if (winningHand !== null) { // If no winning hand is set yet or current hand is higher than the winning hand
                const isCurrentHandHigher = isHigherHand(currentHand, winningHand);
                if (isCurrentHandHigher === true) {
                    winningHand = currentHand;
                    winningPlayers = [player];
                }
                else if (isCurrentHandHigher === null) {
                    winningPlayers.push(player);
                }
            }
            else {
                winningHand = currentHand;
                winningPlayers = [player];
            }
        }
        return winningPlayers; // returns an array with winner objects. ex. [{playerIndex: 2, rankedHand: {rank: 1, best5: [{number: 14, suit: "s"},{number: 7, suit: "d"},{number: 6, suit: "h"},{number: 4, suit: "s"},{number: 3, suit: "c"}]}}]
    }
    
    const isHigherHand = (handA, handB) => {
        for (let i = 0; i < handA.length; i++) {
            if (handA[i].number !== handB[i].number) {
                return handA[i].number > handB[i].number;
            }
        }
        return null; // Hands are equal
    }

    const evaluateHand = (cards) => { // Function to create the rankedHand object which contains the hand's rank and the player's best5 cards
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

    const determineRoyalFlush = (cards) => { // Resolution functions to return a best5 cards or false
        const flush = determineFlush(cards);
        if (flush !== false) {
            if (flush[0] === 14 && flush[1] === 13 && flush[2] === 12 && flush[3] === 11 && flush[4] === 10) {
                return flush
            }
            else {
                return false;
            }
        }
        return false;
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
        return false;
    }
    
    const determineFourOfAKind = (cards) => {
        let best5 = [];
        const cardCounts = {};
        cards.forEach(card => {
            if (!cardCounts[card.number]) {
                cardCounts[card.number] = [];
            }
            cardCounts[card.number].push(card);
        });
        for (const number in cardCounts) { // Iterate over card numbers
            if (cardCounts[number].length === 4) {
                best5 = best5.concat(cardCounts[number]);
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
        } else {
            return false;
        }
    }
    
    const determineFullHouse = (cards) => {
        let best5 = [];
        const cardCounts = {};
        let hasPair = false;
        let hasThreeOfAKind = false;
        cards.forEach(card => {
            if (!cardCounts[card.number]) {
                cardCounts[card.number] = [];
            }
            cardCounts[card.number].push(card);
        });
        for (const number in cardCounts) { // Check if there are two different card numbers with counts 3 and 2 iterating over card numbers
            if (best5.length !== 5) {
                if (cardCounts[number].length === 2 && !hasPair) {
                    best5 = best5.concat(cardCounts[number]);
                    hasPair = true;
                }
                if (cardCounts[number].length === 3 && !hasThreeOfAKind) {
                    best5 = best5.concat(cardCounts[number]);
                    hasThreeOfAKind = true;
                }
            }
        }
        if (best5.length === 5) {
            return best5;
        } else {
            return false;
        }
    }
    
    const determineFlush = (cards) => {
        let best5 = [];
        const suitCards = {};
        cards.forEach(card => {
            if (!suitCards[card.suit]) {
                suitCards[card.suit] = [];
            }
            suitCards[card.suit].push(card);
        });
        for (const suit in suitCards) {
            if (suitCards[suit].length >= 5) {
                best5.push(...suitCards[suit].slice(0, 5));
            }
        }
        if (best5.length === 5) {
            return best5;
        } else {
            return false;
        }
    }

    const determineStraight = (cards) => {
        let best5 = [];
        let straightCards = [];
        for (let i = 0; i < cards.length - 1; i++) {
            straightCards.push(cards[i]);
            if (straightCards.length >= 3) {
                best5 = [...straightCards];
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
        let best5 = [];
        const cardCounts = {};
        cards.forEach(card => {
            if (!cardCounts[card.number]) {
                cardCounts[card.number] = [];
            }
            cardCounts[card.number].push(card);
        });
        for (const number in cardCounts) { // Iterate over card numbers
            if (cardCounts[number].length === 3) {
                best5 = best5.concat(cardCounts[number]);
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
        return false;
    }
    
    const determineTwoPair = (cards) => {
        let best5 = [];
        const cardCounts = {};
        cards.forEach(card => {
            if (!cardCounts[card.number]) {
                cardCounts[card.number] = [];
            }
            cardCounts[card.number].push(card);
        });
        for (const number in cardCounts) { // Iterate over card numbers
            if (cardCounts[number].length === 2) {
                best5 = best5.concat(cardCounts[number]);
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
        let best5 = [];
        const cardCounts = {};
        cards.forEach(card => {
            if (!cardCounts[card.number]) {
                cardCounts[card.number] = [];
            }
            cardCounts[card.number].push(card);
        });
        for (const number in cardCounts) { // Iterate over card numbers
            if (cardCounts[number].length === 2) {
                best5 = best5.concat(cardCounts[number]);
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
        const chipsPerWinner = Math.floor(newGameState.pot / numWinners); // chipsPerWinner finds the whole number of chips for each winner (if there is a decimal its rounded down)
        let newPot = newGameState.pot
        for (let i = 0; i < numWinners; i++) {
            newGameState.players[newGameState.winners[i].playerIndex].chips += chipsPerWinner
            newPot -= chipsPerWinner // subtracts chipsPerWinner from the newPot
        }
        newGameState.players[currentDealerIndex].dealer = false;
        newGameState.players[nextDealerIndex].dealer = true;
        for (let i = 0; i < numPlayers; i++) {
            newGameState.players[i].currentBet = 0
            newGameState.players[i].lastAction = ""
            newGameState.players[i].hand = []
        }
        newGameState.pot = newPot; // if there is a remainder (pot is not evenly divisible by the number of players) the remainder is set to the next pot
        newGameState.river = [];
        newGameState.highestBet = 0;
        newGameState.playersFolded = 0;
        newGameState.winners = [];
        newGameState.state = 4;
        setGameState(newGameState);
        console.log("<-- stop phase: resolve game");
    }

    return (
        <canvas className={styles.poker} ref={canvasRef} width={1700} height={1000}>
        </canvas>
    )
}

export default Poker;