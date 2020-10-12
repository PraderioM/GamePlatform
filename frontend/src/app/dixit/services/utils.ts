import {cardsPath} from './constants';

export function getCardPath(cardID: number): string {
  return cardsPath.concat('/' + cardID.toString() + '.png');
}
