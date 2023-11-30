import { buildNumbersWithLabels } from "../utils/card.util";
import { JOKER, NUMBERS, SUITS } from "./deckCard.const";

const NUMBER_TO_LABEL = buildNumbersWithLabels({numbers: NUMBERS})

const NUMBERS_AND_JOKER = [JOKER, ...NUMBERS]

const NUMBERS_OPTIONS_ARRAY = NUMBERS_AND_JOKER.map((value) => {
  const keyValue = typeof value === 'object' ? value?.suit : NUMBER_TO_LABEL[value]
  const LabelValue = typeof value === 'object' ? value?.suit?.toUpperCase() : NUMBER_TO_LABEL[value]
  const numberValue = typeof value === 'object' ? value?.value : value
  
  return ({
    key: keyValue,
    label: LabelValue,
    value: numberValue
  })
})

const [jokerOption, firstOption, ...restOptions] = NUMBERS_OPTIONS_ARRAY
export const NUMBERS_OPTIONS = [...restOptions, firstOption, jokerOption]

export const SUITS_OPTIONS = SUITS.map((suit) => {
  return ({
    key: suit,
    label: suit,
    value: suit
  })
})