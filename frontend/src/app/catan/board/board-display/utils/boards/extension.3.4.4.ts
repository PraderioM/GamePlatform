import {Port} from '../models';
import {generateLandPositionList, generateExternalLandPositionList} from '../board.generation.utils';

export const extension344PortList = [
  new Port('generic', Math.PI, -22),
  new Port('wood', - 2 * Math.PI / 3, -20),
  new Port('generic', - Math.PI / 3, -18),
  new Port('brick', -2 * Math.PI / 3, -17),
  new Port('generic', - Math.PI / 3, -15),
  new Port('generic', 0, -12),
  new Port('sheep', Math.PI / 3, -10),
  new Port('generic', Math.PI / 3, -8),
  new Port('stone', 2 * Math.PI / 3, -5),
  new Port('sheep', 2 * Math.PI / 3, -3),
  new Port('wheat', 2 * Math.PI / 3, -2),
];

export const extension344LandPositionList = generateLandPositionList(3, 4, 4);

export const extension344ExternalLandPositionList = generateExternalLandPositionList(3, 4, 4);
