import {Port} from '../models';
import {generateExternalLandPositionList, generateLandPositionList} from '../board.generation.utils';

export const classicPortList = [
  new Port('wood', 0., -9),
  new Port('brick', -Math.PI / 3, -13),
  new Port('sheep', Math.PI, -18),
  new Port('wheat', Math.PI / 3, -5),
  new Port('stone', Math.PI / 3, -7),
  new Port('generic', -2 * Math.PI / 3, -15),
  new Port('generic', 0., -11),
  new Port('generic', Math.PI / 3, -6),
  new Port('generic', Math.PI, -2)
];

export const classicLandPositionList = generateLandPositionList(3, 3, 3);

export const classicExternalLandPositionList = generateExternalLandPositionList(3, 3, 3);
