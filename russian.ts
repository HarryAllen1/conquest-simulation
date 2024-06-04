import { Card, ranks, shuffle, suits } from "./utils.ts";

const unshuffledDeck = suits.flatMap((suit) =>
  ranks.filter((r) => r > 6).map((rank) => ({ suit, rank, belongsTo: 0 }))
);

let deck = shuffle(shuffle(unshuffledDeck));
let player1Hand = deck.splice(0, 6).map((card) => ({
  ...card,
  belongsTo: 1,
}));
let player2Hand = deck.splice(0, 6).map((card) => ({
  ...card,
  belongsTo: 2,
}));
const trumpSuit = deck.splice(0, 1)[0].suit;
let table: Card[] = [];

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

const attack = (
  attackerHand: Card[],
  defenderHand: Card[],
  table: Card[],
): [Card[], Card[], Card[]] => {
  let attackCard = attackerHand[0]; // Select the first card for simplicity
  attackerHand = attackerHand.slice(1); // Remove the selected card from the hand
  table.push(attackCard); // Add the selected card to the table
  return [attackerHand, defenderHand, table];
};

const defend = (
  defenderHand: Card[],
  attackerHand: Card[],
  table: Card[],
): [Card[], Card[], Card[]] => {
  for (let i = 0; i < defenderHand.length; i++) {
    let defendCard = defenderHand[i];
    // Check if the card can defend the attack
    if (defendCard.suit === table[0].suit && defendCard.rank > table[0].rank) {
      defenderHand = defenderHand.slice(0, i).concat(defenderHand.slice(i + 1)); // Remove the card from the hand
      table.push(defendCard); // Add the card to the table
      return [defenderHand, attackerHand, table];
    }
  }
  // If the defender cannot defend, they take all cards from the table
  defenderHand = defenderHand.concat(table);
  table = [];
  return [defenderHand, attackerHand, table];
};

const drawCards = (hand: Card[], deck: Card[]): [Card[], Card[]] => {
  while (hand.length < 6 && deck.length > 0) {
    hand.push(deck.pop()!);
  }
  return [hand, deck];
};

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
