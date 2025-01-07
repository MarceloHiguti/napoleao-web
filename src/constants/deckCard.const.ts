export enum SUITS_TYPES {
  Diamonds = 'diamonds',
  Spades = 'spades',
  Hearts = 'hearts',
  Clubs = 'clubs',
  Joker = 'joker',
  NoSuit = 'noSuit',
}

export const SUITS = [SUITS_TYPES.Diamonds, SUITS_TYPES.Spades, SUITS_TYPES.Hearts, SUITS_TYPES.Clubs];

export const NUMBERS = Array.from({ length: 13 }, (_, i) => i + 1);

export const JOKER = {
  value: 50,
  suit: 'joker',
};

export const PILE = 'pile';
export const ACE_AMPLIFIER = 20;
export const SUPER_SUIT_AMPLIFIER = 25;
export const COPINHO_AMPLIFIER = 100;
