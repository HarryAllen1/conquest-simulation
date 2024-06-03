import { Card, ranks, shuffle, suits } from "./utils.ts";

const unshuffledDeck = [
  ...suits.flatMap((suit) =>
    ranks.map((rank) => ({ suit, rank, belongsTo: 0 }))
  ),
  { suit: "Joker", rank: 15, belongsTo: 0 },
  { suit: "Joker", rank: 15, belongsTo: 0 },
];

const runGame = (): number => {
  const shuffledDeck = shuffle(unshuffledDeck);
  let player1Wins = 0;
  let player2Wins = 0;
  let ties = 0;

  const runBattleSimulation = () => {
    const player1Hand = shuffledDeck.slice(0, 4 + player1Wins + 1).map((
      card,
    ) => ({
      ...card,
      belongsTo: 1,
    }));
    shuffledDeck.splice(0, 5);
    const player2Hand = shuffledDeck.slice(0, 4 + player2Wins + 2).map((
      card,
    ) => ({
      ...card,
      belongsTo: 2,
    }));
    shuffledDeck.splice(0, 5);

    const board: Card[] = [];

    console.log({ player1Hand, player2Hand });

    // player 1 always goes first
    // player 1 places down two cards which are the lowest non-joker non-spade cards
    for (let i = 0; i < 1; i++) {
      const lowestCard = player1Hand
        .filter((card) => card.suit !== "S" && card.suit !== "Joker")
        .sort((a, b) => (a.rank) - (b.rank))[0];
      // if no card available, skip turn
      if (!lowestCard) break;
      board.push(lowestCard);
      player1Hand.splice(player1Hand.indexOf(lowestCard), 1);
    }

    console.log({ player1Hand, player2Hand, board });

    while (player1Hand.length > 0 || player2Hand.length > 0) {
      const didPlayer1Play = playPlayer1(board, player1Hand, player2Hand);
      const didPlayer2Play = playPlayer2(board, player1Hand, player2Hand);

      if (!didPlayer1Play && !didPlayer2Play) {
        break;
      }
    }

    const stats = board.filter((c) => !c.isCounter).reduce(
      (acc, card) => {
        if (card.belongsTo === 1) {
          acc.player1Wins++;
        } else {
          acc.player2Wins++;
        }
        return acc;
      },
      { player1Wins: 0, player2Wins: 0 },
    );

    const doesPlayer1HaveJoker = !!player1Hand.find((c) => c.suit === "Joker");
    const doesPlayer2HaveJoker = !!player2Hand.find((c) => c.suit === "Joker");
    if (doesPlayer1HaveJoker && !doesPlayer2HaveJoker) {
      stats.player1Wins++;
      return;
    } else if (!doesPlayer1HaveJoker && doesPlayer2HaveJoker) {
      stats.player2Wins++;
      return;
    } else if (doesPlayer1HaveJoker && doesPlayer2HaveJoker) {
      ties++;
      return;
    }

    if (stats.player1Wins > stats.player2Wins) {
      player1Wins++;
    } else if (stats.player1Wins < stats.player2Wins) {
      player2Wins++;
    } else {
      ties++;
    }
  };

  const playPlayer1 = (
    board: Card[],
    player1Hand: Card[],
    player2Hand: Card[],
  ): boolean => {
    let didPlay = false;
    for (let i = 0; i < board.length; i++) {
      if (board[i].isCounter || board[i].belongsTo === 1) continue;
      const card = board[i];
      const counter = player1Hand.find(
        (c) =>
          ((c.suit === "C" && card.suit === "D") ||
            (c.suit === "D" && card.suit === "H") ||
            (c.suit === "H" && card.suit === "C") ||
            (c.suit === "S" && card.suit !== "S")) &&
          ((c.rank) > (card.rank)),
        //    ||
        // (c.suit === card.suit &&
        //   ranks.indexOf(c.rank) > ranks.indexOf(card.rank)),
      );
      if (counter) {
        board[i] = { ...counter, isCounter: true };
        player1Hand.splice(player1Hand.indexOf(counter), 1);
        didPlay = true;
      } else if (player1Hand.length === 1 && player1Hand[0].suit === "Joker") {
        board[i] = { ...player1Hand[0], isCounter: true };
        player1Hand.splice(0, 1);
        didPlay = true;
      }
    }

    console.log({ player1Hand, player2Hand, board });

    // player 2 then plays the lowest card in their hand that isn't a joker or spade
    const lowestCard = player1Hand
      .filter((card) => card.suit !== "S" && card.suit !== "Joker")
      .sort((a, b) => (a.rank) - (b.rank))[0];
    if (lowestCard) {
      board.push(lowestCard);
      player1Hand.splice(player1Hand.indexOf(lowestCard), 1);
      didPlay = true;
    }

    console.log({ player1Hand, player2Hand, board });
    return didPlay;
  };

  const playPlayer2 = (
    board: Card[],
    player1Hand: Card[],
    player2Hand: Card[],
  ): boolean => {
    let didPlay = false;
    // player 2 counters player 1's cards with the following counters:
    // clubs beat diamonds, no matter the rank
    // diamonds beat hearts, no matter the rank
    // hearts beat clubs, no matter the rank
    // spades beats all other cards, no matter the suit, only if the rank is greater
    // jokers beat all cards in play
    for (let i = 0; i < board.length; i++) {
      if (board[i].isCounter || board[i].belongsTo === 2) continue;
      const card = board[i];
      const counter = player2Hand.find(
        (c) => (((c.suit === "C" && card.suit === "D") ||
          (c.suit === "D" && card.suit === "H") ||
          (c.suit === "H" && card.suit === "C") ||
          (c.suit === "S" && card.suit !== "S")) &&
          ((c.rank) > (card.rank))),
        // ) ||
        // (c.suit === card.suit &&
        //   ranks.indexOf(c.rank) > ranks.indexOf(card.rank)),
      );
      if (counter) {
        board[i] = { ...counter, isCounter: true };
        player2Hand.splice(player2Hand.indexOf(counter), 1);
        didPlay = true;
      } else if (player2Hand.length === 1 && player2Hand[0].suit === "Joker") {
        board[i] = { ...player2Hand[0], isCounter: true };
        player2Hand.splice(0, 1);
        didPlay = true;
      }
    }

    console.log({ player1Hand, player2Hand, board });

    // player 2 then plays the lowest card in their hand that isn't a joker or spade
    const lowestCard = player2Hand
      .filter((card) => card.suit !== "S" && card.suit !== "Joker")
      .sort((a, b) => (a.rank) - (b.rank))[0];
    if (lowestCard) {
      board.push(lowestCard);
      player2Hand.splice(player2Hand.indexOf(lowestCard), 1);
      didPlay = true;
    }

    console.log({ player1Hand, player2Hand, board });
    return didPlay;
  };

  while (shuffledDeck.length > 0) {
    const beforeDeckLength = shuffledDeck.length;
    runBattleSimulation();
    if (shuffledDeck.length === beforeDeckLength) break;
  }

  if (player1Wins > player2Wins) {
    return 1;
  }
  if (player1Wins < player2Wins) {
    return 2;
  }
  return 0;
};

const totalGames = 100;
let player1Wins = 0;
let player2Wins = 0;
let ties = 0;
for (let i = 0; i < totalGames; i++) {
  const winner = runGame();
  if (winner === 1) {
    player1Wins++;
  } else if (winner === 2) {
    player2Wins++;
  } else {
    ties++;
  }
}
console.log({ player1Wins, player2Wins, ties });
