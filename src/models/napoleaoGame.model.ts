import { DeckCardConstructor } from 'src/components/DeckCard/DeckCard.model';

export interface SaveNapoleaoSplitedCardsInFirebaseParams {
  idToConnect: string;
  playersOnline: string[];
}

export interface SaveRoundCardsPlayedParams {
  idToConnect: string;
  playerId: string;
  roundNumber: number;
  card: DeckCardConstructor;
}
