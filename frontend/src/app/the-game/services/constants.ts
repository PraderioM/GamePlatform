import {assetsPath as generalAssetsPath} from '../../services/constants';

export const assetsPath = generalAssetsPath.concat('/the-game');
export const fireImgPath = assetsPath.concat('/fire.png');
export const maxCard = 100;
export const defaultDeckSize = {
  1: 8,
  2: 7,
  3: 6,
  4: 6,
  5: 6
};
export const defaultMinToPlayCards = 2;
export const onFireCardList = [22, 33, 44, 55, 66, 77];
