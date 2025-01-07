import { DeckCard } from 'src/components/DeckCard/DeckCard.class';
import { DeckCardConstructor } from 'src/components/DeckCard/DeckCard.model';
import { SUITS_TYPES } from 'src/constants/deckCard.const';

export interface SaveNapoleaoSplitedCardsInFirebaseParams {
  idToConnect: string;
  playersOnline: string[];
}

export interface SaveRoundCardsPlayedParams {
  idToConnect: string;
  playerUid: string;
  roundNumber: number;
  card: DeckCardConstructor;
}

export interface PlayersInLobby {
  email: string;
  name: string;
  uid: string;
  index: number;
  isBot: boolean;
}

export interface LobbyData {
  players: ReadonlyArray<PlayersInLobby>;
  playersCards: Record<string, DeckCard[]>;
  rounds: any;
  onlineGameProps: any;
}

export enum GAME_STEPS {
  Lobby = 'lobby',
  ChooseNapoleao = 'chooseNapoleao',
  ChooseSuperSuit = 'chooseSuperSuit',
  ChangePile = 'changePile',
  ChooseCopinho = 'chooseCopinho',
  GameStarted = 'gameStarted',
}

export interface OnlineGameProps {
  gameStep?: GAME_STEPS;
  roundNumber?: number;
  turnFromPlayerIndex?: number;
  superSuit?: SUITS_TYPES;
  napoleao?: {
    playerUid: string;
    honrasQuantity: string;
  };
  copinho?: {
    playerUid: string;
    card: DeckCardConstructor;
  };
}

export interface UpdatedPlayersCards {
  idToConnect: string;
  newPlayersCards: Record<string, DeckCardConstructor[]>;
  newGameProps?: OnlineGameProps;
}

export interface UpdatedOnlineGameProps {
  idToConnect: string;
  newGameProps?: OnlineGameProps;
}

export interface NextRoundParams {
  idToConnect: string;
  currentPlayerIndex: number;
  newGameProps?: OnlineGameProps;
}

export interface UpdatePlayerDataParams {
  idToConnect: string;
  uid: string;
  playerNewData: {
    name?: string;
    email?: string;
    index?: number;
  };
}
