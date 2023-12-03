import { DeckCard } from 'src/components/DeckCard/DeckCard.class';
import { DeckCardConstructor } from 'src/components/DeckCard/DeckCard.model';

export interface CreateDeckParams {
  numbers: number[];
  suits: string[];
  extraCards?: Record<string, any>;
  deckModifierCallback?: (deck: DeckCardConstructor[]) => void;
  deckNumber?: number;
}

export type CardType = DeckCard | DeckCardConstructor;
export type DeckType = Array<CardType>;

export interface DistributeCardsParams {
  deck: DeckType;
  numberOfCards: number;
  numberOfPlayers: number;
  playersIndex?: Array<string>;
}

export interface BuildNumbersWithLabelsParams {
  numbers: number[];
}

export interface DrawCardsParams {
  deck: DeckType;
  numberToDraw?: number;
}

export interface DrawCardsReturnValues {
  cardsDrew: Array<CardType>;
  deckPile: DeckType;
}

export interface RecursiveDistributeCardsParams {
  deck: DeckType;
  numberOfCards: number;
  numberOfPlayers: number;
  playerIndex: number;
  playersObject: Record<string, DeckType>;
  playersCustomIndex?: Array<string>;
}
