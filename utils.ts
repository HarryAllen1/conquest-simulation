export interface Card {
  suit: string;
  rank: number;
  belongsTo: number;
  isCounter?: boolean;
}
export const suits = ["H", "D", "C", "S"];
export const ranks = [
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11, // J
  12,
  13,
  14, // A
];

/**
 * immutable shuffle
 */
export const shuffle = (deck: Card[]) => {
  const deckCopy = [...deck];
  for (let i = 0; i < 10; i++) {
    for (let i = deckCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      [deckCopy[i], deckCopy[j]] = [deckCopy[j], deckCopy[i]];
    }
  }
  return deckCopy;
};
