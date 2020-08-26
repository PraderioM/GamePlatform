import {LandPosition} from './models';

const changeRowSpeed = 3 / 4;
const changeColInRowSpeed = 1;
const changeColBetweenRowsSpeed = 1 / 2;

export function generateLandPositionList(lowerWidthSize: number, lowerHeightSize: number, upperHeightSize: number): LandPosition[] {
  const upperWidthSize = lowerWidthSize + lowerHeightSize - upperHeightSize;

  const landPositionList: LandPosition[] = [];
  let currentLand = new LandPosition(changeRowSpeed * (lowerHeightSize + upperHeightSize - 2) / 2,
                                      - changeColInRowSpeed * lowerWidthSize / 2);
  let index = -1;
  let currentSide = 0;
  while (!isLandInList(currentLand, landPositionList)) {
    index += 1;
    landPositionList.push(currentLand);

    // For first round positioning is directed.
    if (index < lowerWidthSize - 1 ) {
      currentSide = 0;
    } else if (index < lowerWidthSize + lowerHeightSize - 2) {
      currentSide = 1;
    } else if (index < lowerWidthSize + lowerHeightSize + upperHeightSize - 3) {
      currentSide = 2;
    } else if (index < lowerWidthSize + lowerHeightSize + upperHeightSize + upperWidthSize - 4) {
      currentSide = 3;
    } else if (index < lowerWidthSize + lowerHeightSize + upperHeightSize + upperWidthSize + upperHeightSize - 5) {
      currentSide = 4;
    } else if (index < lowerWidthSize + lowerHeightSize + upperHeightSize + upperWidthSize + upperHeightSize + lowerHeightSize - 7) {
      currentSide = 5;
    }

    let newLand = moveOnSide(currentLand, currentSide);
    let j = 0;
    while (isLandInList(newLand, landPositionList) && j < 6) {
      j += 1;
      currentSide = updateSide(currentSide);
      newLand = moveOnSide(currentLand, currentSide);
    }
    currentLand = newLand;

  }

  return landPositionList;
}

export function generateExternalLandPositionList(lowerWidthSize: number, lowerHeightSize: number, upperHeightSize: number): LandPosition[] {
  const upperWidthSize = lowerWidthSize + lowerHeightSize - upperHeightSize;

  const landPositionList: LandPosition[] = [];
  let currentLand = new LandPosition(changeRowSpeed * (lowerHeightSize + upperHeightSize - 2) / 2,
                                     - changeColInRowSpeed * (lowerWidthSize / 2 + 1));

  for (let index = 0;
       index < 2 * lowerHeightSize + 2 * upperHeightSize + upperWidthSize + lowerWidthSize;
       index ++) {
    landPositionList.push(currentLand);

    // Update current land according to current land.
    if (index < lowerHeightSize - 1) {
      currentLand = moveOnSide(currentLand, 2);
    } else if (index < lowerHeightSize - 1 + upperHeightSize) {
      currentLand = moveOnSide(currentLand, 1);
    } else if (index < lowerHeightSize - 1 + upperHeightSize + upperWidthSize) {
      currentLand = moveOnSide(currentLand, 0);
    } else if (index < lowerHeightSize - 1 + upperHeightSize + upperWidthSize + upperHeightSize) {
      currentLand = moveOnSide(currentLand, 5);
    } else if (index < lowerHeightSize - 1 + upperHeightSize + upperWidthSize + upperHeightSize + lowerHeightSize) {
      currentLand = moveOnSide(currentLand, 4);
    } else {
      currentLand = moveOnSide(currentLand, 3);
    }
  }

  return landPositionList;
}

function isLandInList(land: LandPosition, landList: LandPosition[]): boolean {
  for (const sampleLand of landList) {
    if (sampleLand.heightFrac === land.heightFrac && sampleLand.widthFrac === land.widthFrac) {
      return true;
    }
  }
  return false;
}


function moveOnSide(land: LandPosition, side: number): LandPosition {
  side = side % 6;

  if (side === 0) {
    return new LandPosition(land.heightFrac, land.widthFrac + changeColInRowSpeed);
  } else if (side === 1) {
    return  new LandPosition(land.heightFrac - changeRowSpeed, land.widthFrac + changeColBetweenRowsSpeed);
  } else if (side === 2) {
    return new LandPosition(land.heightFrac - changeRowSpeed, land.widthFrac - changeColBetweenRowsSpeed);
  } else if (side === 3) {
    return new LandPosition(land.heightFrac, land.widthFrac - changeColInRowSpeed);
  } else if (side === 4) {
    return new LandPosition(land.heightFrac + changeRowSpeed, land.widthFrac - changeColBetweenRowsSpeed);
  } else {
    return new LandPosition(land.heightFrac + changeRowSpeed, land.widthFrac + changeColBetweenRowsSpeed);
  }
}

function updateSide(side: number): number {
  return (side + 1) % 6;
}
