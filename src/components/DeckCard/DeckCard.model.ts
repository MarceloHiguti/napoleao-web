import { SUITS_TYPES } from 'src/constants/deckCard.const';

export interface DeckCardConstructor {
  ownerId: string;
  key: string;
  suit: SUITS_TYPES;
  value: number;
  extraParams?: Record<string, any>;
  extraProps?: Record<string, any>;
}

export enum CARD_MASK_TYPE {
  Discard = 'discard',
  Copinho = 'copinho',
}

export interface DeckCardProps {
  card: DeckCardConstructor;
  isOffside?: boolean;
  onClick?: (card: DeckCardConstructor) => void;
  mask?: CARD_MASK_TYPE;
}
