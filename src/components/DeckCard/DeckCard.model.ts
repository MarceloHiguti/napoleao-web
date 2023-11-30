export interface DeckCardConstructor {
  key: string;
  suit: string;
  value: number;
  extraParams?: Record<string, any>;
}

export interface DeckCardProps {
  card: DeckCardConstructor;
  side?: string;
  onClick?: (card: DeckCardConstructor) => void;
}
