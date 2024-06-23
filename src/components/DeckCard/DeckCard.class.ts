import { DeckCardConstructor } from './DeckCard.model';

export class DeckCard {
  ownerId: string;
  key: string;
  suit: string;
  value: number;
  extraParams?: Record<string, any>;

  constructor({ ownerId, key, suit, value, extraParams }: DeckCardConstructor) {
    this.ownerId = ownerId;
    this.key = key;
    this.suit = suit;
    this.value = value;
    this.extraParams = extraParams ?? {};
  }

  get getOwnerId() {
    return this.ownerId;
  }

  get getKey() {
    return this.key;
  }

  get getSuit() {
    return this.suit;
  }

  get getValue() {
    return this.value;
  }

  get getExtraParams() {
    return this.extraParams;
  }

  set setOwnerId(newOwnerId: string) {
    this.ownerId = newOwnerId;
  }

  set setSuit(newSuit: string) {
    this.suit = newSuit;
  }

  set setValue(newValue: number) {
    this.value = newValue;
  }

  set setExtraParams(newExtraParams: Record<string, any>) {
    this.extraParams = {
      ...this.extraParams,
      ...newExtraParams,
    };
  }
}
