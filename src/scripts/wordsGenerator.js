import {
  COMMON_WORDS,
} from "../constants/WordsMostCommon";
import {
  DEFAULT_WORDS_COUNT,
} from "../constants/Constants";
import { randomIntFromRange } from "./randomUtils";

const wordsGenerator = (
  wordsCount,
) => {
      const WordList = [];
      for (let i = 0; i < DEFAULT_WORDS_COUNT; i++) {
        const rand = randomIntFromRange(0, 550);
        let wordCandidate = COMMON_WORDS[rand].val;
        WordList.push({ key: wordCandidate, val: wordCandidate });
      }
      return WordList;
};
export { wordsGenerator };
