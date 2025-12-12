import { WinningResultType } from './ResultInput';

export const checkSameNumber = (numbers: WinningResultType[]) => {
  for (let i = 0; i < 6; i++) {
    for (let j = i + 1; j < 7; j++) {
      if (numbers[i].number === numbers[j].number) {
        return false;
      }
    }
  }
  return true;
};
