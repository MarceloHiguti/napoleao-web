export interface DeckConstructor {
  numbers: number[];
  suits: string[];
  extraCards: Record<string, any>;
}
