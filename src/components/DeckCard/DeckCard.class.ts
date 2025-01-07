import { SUITS_TYPES } from 'src/constants/deckCard.const';
import { DeckCardConstructor } from './DeckCard.model';

export class DeckCard {
  ownerId: string;
  key: string;
  suit: SUITS_TYPES;
  value: number;
  extraParams?: Record<string, any>;
  extraProps?: Record<string, any>;

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

  get getExtraProps() {
    return this.extraProps;
  }

  set setOwnerId(newOwnerId: string) {
    this.ownerId = newOwnerId;
  }

  set setSuit(newSuit: SUITS_TYPES) {
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

  set setExtraProps(newExtraProps: Record<string, any>) {
    this.extraProps = {
      ...this.extraProps,
      ...newExtraProps,
    };
  }
}
