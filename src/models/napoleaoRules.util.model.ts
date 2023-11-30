import { DeckCard } from 'src/components/DeckCard/DeckCard.class';

export interface NapoleaoRoundWinnerParams {
  selectedCards: Record<string, DeckCard>;
}

export interface IncludeSuperSuitAndCopinhoInCardsParams {
  splitedCards: Map<string, DeckCard[]>;
  superSuit: string;
  copinho: string;
}

export interface GetCopinhoCardKeyParams {
  number: number;
  suit: string;
  deckNumber?: number;
}

export interface CalculateCardStrengthParams {
  card: DeckCard;
  validSuit: string;
}

export interface NapoleaoDeckModifierParams {
  cards: DeckCard[];
}
