import {
  assetsPath,
  lossImageArray,
  lossScope,
  observingImageArray,
  observingScope,
  tieImageArray,
  tieScope,
  winImageArray,
  winScope, WTFImageArray, WTFScope
} from './constants';
import {GameResolution} from './models';

export function getImageURL(gameResolution: GameResolution) {
  let scope: string;
  let imageArray: string[];
  if (this.gameResolution.isLoser) {
    scope = lossScope;
    imageArray = lossImageArray;
  } else if (gameResolution.isTie) {
    scope = tieScope;
    imageArray = tieImageArray;
  } else if (gameResolution.isVictorious) {
    scope = winScope;
    imageArray = winImageArray;
  } else if (gameResolution.isObserver) {
    scope = observingScope;
    imageArray = observingImageArray;
  } else {
    scope = WTFScope;
    imageArray = WTFImageArray;
  }
  return assetsPath.concat(scope).concat(imageArray[Math.floor(Math.random() * imageArray.length)]);

}
