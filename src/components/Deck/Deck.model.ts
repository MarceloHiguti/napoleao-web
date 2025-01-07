import { SUITS_TYPES } from 'src/constants/deckCard.const';

export interface DeckConstructor {
  numbers?: number[];
  suits?: SUITS_TYPES[];
  extraCards: Record<string, any>;
}
