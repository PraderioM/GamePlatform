import {assetsPath, cardsDirName} from './constants';

export function getCardPath(cardID: number, imageSet: string): string {
  return assetsPath.concat('/' + imageSet + '/' + cardsDirName + '/' + cardID.toString() + '.png');
}

export function getCardBackPath(imageSet: string): string {
  return assetsPath.concat('/' + imageSet + '/back.png');
}
