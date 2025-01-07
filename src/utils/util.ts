import { DeckCard as DeckCardClass } from 'src/components/DeckCard/DeckCard.class';
import { SUITS_TYPES } from 'src/constants/deckCard.const';

export function convertMapToString<T>(mapParam: Map<unknown, T>): string {
  const convertedObject = Object.fromEntries(mapParam);
  return JSON.stringify(convertedObject);
}

export function convertMapToObject<T>(mapParam: Map<unknown, T>): Record<string, string> {
  const convertedObject = Object.fromEntries(mapParam);
  const objectWithStringify = Object.entries(convertedObject).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: JSON.stringify(value),
    };
  }, {});
  return objectWithStringify;
}

export function convertObjectToMap<T>(objParam: Record<string, string>): Map<string | number, T> {
  const objectParsed = Object.entries(objParam).reduce((acc, [mapKey, mapValue]) => {
    const arrayValue = JSON.parse(mapValue);
    const arrayOfDeckCard = arrayValue.map(
      ({ key, suit, value }: { key: string; suit: SUITS_TYPES; value: number }) =>
        new DeckCardClass({ ownerId: '', key, suit, value }),
    );
    return {
      ...acc,
      [mapKey]: arrayOfDeckCard,
    };
  }, {});
  return new Map(Object.entries(objectParsed));
}
