import { Card, ranks, shuffle, suits } from "./utils.ts";

const unshuffledDeck = suits.flatMap((suit) =>
  ranks.filter((r) => r > 6).map((rank) => ({ suit, rank, belongsTo: 0 }))
);

const deck = shuffle(shuffle(unshuffledDeck));
let player1Hand = deck.splice(0, 6).map((card) => ({
  ...card,
  belongsTo: 1,
}));
let player2Hand = deck.splice(0, 6).map((card) => ({
  ...card,
  belongsTo: 2,
}));
const trumpSuit = deck.splice(0, 1)[0].suit;

// switch player 1 and 2s hands if player 2 has the lowest trump card
const player1LowestTrump = player1Hand
  .filter((c) => c.suit === trumpSuit)
  .sort((a, b) => a.rank - b.rank)[0];
const player2LowestTrump = player2Hand
  .filter((c) => c.suit === trumpSuit)
  .sort((a, b) => a.rank - b.rank)[0];
if (
  player2LowestTrump && player1LowestTrump &&
  player1LowestTrump.rank > player2LowestTrump.rank
) {
  [player1Hand, player2Hand] = [player2Hand, player1Hand];
}

console.log({ player1Hand, player2Hand, trumpSuit });

function attack(
  attackerHand: Card[],
  defenderHand: Card[],
  table: Card[],
): [Card[], Card[], Card[]] {
  // Implement the attack logic here
}

function defend(
  defenderHand: Card[],
  attackerHand: Card[],
  table: Card[],
): [Card[], Card[], Card[]] {
  // Implement the defense logic here
}

function drawCards(hand: Card[], deck: Card[]): [Card[], Card[]] {
  while (hand.length < 6 && deck.length > 0) {
    hand.push(deck.pop()!);
  }
  return [hand, deck];
}

while (player1Hand.length > 0 && player2Hand.length > 0) {
  [player1Hand, player2Hand, table] = attack(player1Hand, player2Hand, table);
  [player2Hand, player1Hand, table] = defend(player2Hand, player1Hand, table);
  if (table.length > 0) {
    player2Hand = player2Hand.concat(table);
    table = [];
  } else {
    [player1Hand, player2Hand] = [player2Hand, player1Hand];
  }
  [player1Hand, deck] = drawCards(player1Hand, deck);
  [player2Hand, deck] = drawCards(player2Hand, deck);
}

console.log(player1Hand.length === 0 ? "Player 2 loses" : "Player 1 loses");
