import { DeckCard } from 'src/components/DeckCard/DeckCard.class';
import { DeckCardConstructor } from 'src/components/DeckCard/DeckCard.model';

export interface NapoleaoRoundWinnerParams {
  selectedCards: Record<string, DeckCardConstructor>;
}
export interface NapoleaoRoundWinnerResult {
  winnerId: string;
  winnerCard: { key: string; suit: string; value: number };
  winnerCardStregth: number;
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
