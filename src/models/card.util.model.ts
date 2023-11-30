import { Deck } from 'src/components/Deck/Deck.class';
import { DeckCardConstructor } from 'src/components/DeckCard/DeckCard.model';

export interface CreateDeckParams {
  numbers: number[];
  suits: string[];
  extraCards?: Record<string, any>;
  deckModifierCallback?: (deck: DeckCardConstructor[]) => void;
  deckNumber?: number;
}

export interface DistributeCardsParams {
  deck: Deck;
  numberOfCards: number;
  numberOfPlayers: number;
}

export interface BuildNumbersWithLabelsParams {
  numbers: number[];
}
