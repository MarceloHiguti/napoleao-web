import { DeckCard } from 'src/components/DeckCard/DeckCard.class';
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

export interface PlayersInLobby {
  email: string;
  name: string;
  uid: string;
}

export interface LobbyData {
  players: ReadonlyArray<PlayersInLobby>;
  playersCards: Record<string, DeckCard[]>;
  rounds: any;
}
