interface Card {
  suit: string;
  rank: string;
  belongsTo: number;
}
const suits = ["H", "D", "C", "S"];
const ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
const deck = [
  ...suits.flatMap((suit) =>
    ranks.map((rank) => ({ suit, rank, belongsTo: 0 }))
  ),
  { suit: "Joker", rank: "Joker", belongsTo: 0 },
  { suit: "Joker", rank: "Joker", belongsTo: 0 },
];

// immutable shuffle
const shuffle = (deck: Card[]) => {
  const deckCopy = [...deck];
  for (let i = 0; i < 10; i++) {
    for (let i = deckCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      [deckCopy[i], deckCopy[j]] = [deckCopy[j], deckCopy[i]];
    }
  }
  return deckCopy;
};

const runSimulation = () => {
  const shuffledDeck = shuffle(deck);

  const player1Hand = shuffledDeck.slice(0, 5).map((card) => ({
    ...card,
    belongsTo: 1,
  }));
  shuffledDeck.splice(0, 5);
  const player2Hand = shuffledDeck.slice(0, 5).map((card) => ({
    ...card,
    belongsTo: 2,
  }));
  shuffledDeck.splice(0, 5);

  const board: Card[] = [];

  console.log({ player1Hand, player2Hand });

  // player 1 always goes first
  // player 1 places down two cards which are the lowest non-joker non-spade cards
  for (let i = 0; i < 2; i++) {
    const lowestCard = player1Hand
      .filter((card) => card.suit !== "S" && card.rank !== "Joker")
      .sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank))[0];
    // if no card available, skip turn
    if (!lowestCard) break;
    board.push(lowestCard);
    player1Hand.splice(player1Hand.indexOf(lowestCard), 1);
  }

  console.log({ player1Hand, player2Hand, board });

  // player 2 counters player 1's cards with the following counters:
  // clubs beat diamonds, no matter the rank
  // diamonds beat hearts, no matter the rank
  // hearts beat clubs, no matter the rank
  // spades beats all other cards, no matter the suit, only if the rank is greater
  // jokers beat all cards in play
  for (let i = 0; i < board.length; i++) {
    const card = board[i];
    const counter = player2Hand.find(
      (c) =>
        (c.suit === "C" && card.suit === "D") ||
        (c.suit === "D" && card.suit === "H") ||
        (c.suit === "H" && card.suit === "C") ||
        (c.suit === "S" && card.suit !== "S" &&
          ranks.indexOf(c.rank) > ranks.indexOf(card.rank)) ||
        (c.suit === card.suit &&
          ranks.indexOf(c.rank) > ranks.indexOf(card.rank)),
    );
    if (counter) {
      board[i] = counter;
      player2Hand.splice(player2Hand.indexOf(counter), 1);
    } else if (player2Hand.length === 1 && player2Hand[0].rank === "Joker") {
      board[i] = player2Hand[0];
      player2Hand.splice(0, 1);
    }
  }

  console.log({ player1Hand, player2Hand, board });
};

runSimulation();
