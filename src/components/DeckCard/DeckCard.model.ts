export interface DeckCardConstructor {
  key: string;
  suit: string;
  value: number;
  extraParams?: Record<string, any>;
}

export interface DeckCardProps {
  card: DeckCardConstructor;
  isOffside?: boolean;
  onClick?: (card: DeckCardConstructor) => void;
}
