import {Port} from '../models';
import {generateLandPositionList, generateExternalLandPositionList} from '../board.generation.utils';

// Todo fix rotation.
export const extension344PortList = [
  new Port('generic', 4 * Math.PI / 3, -22),
  new Port('wood', 4 * Math.PI / 3, -20),
  new Port('generic', 4 * Math.PI / 3, -18),
  new Port('brick', 4 * Math.PI / 3, -17),
  new Port('generic', 4 * Math.PI / 3, -15),
  new Port('generic', 4 * Math.PI / 3, -12),
  new Port('sheep', 4 * Math.PI / 3, -10),
  new Port('generic', 4 * Math.PI / 3, -8),
  new Port('stone', 4 * Math.PI / 3, -5),
  new Port('sheep', 4 * Math.PI / 3, -3),
  new Port('wheat', 4 * Math.PI / 3, -2),
];

export const extension344LandPositionList = generateLandPositionList(3, 4, 4);

export const extension344ExternalLandPositionList = generateExternalLandPositionList(3, 4, 4);
