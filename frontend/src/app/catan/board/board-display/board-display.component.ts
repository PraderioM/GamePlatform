import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {GameDescription, NumberedLand} from '../../services/models';
import {assetsPath} from '../../services/constants';
import {BuildPlay} from '../../services/plays/build';
import {LandPosition, Port} from './utils/models';
import {extension344ExternalLandPositionList, extension344LandPositionList, extension344PortList} from './utils/boards/extension.3.4.4';
import {classicExternalLandPositionList, classicLandPositionList, classicPortList} from './utils/boards/classic';


@Component({
  selector: 'app-board-display',
  templateUrl: './board-display.component.html',
  styleUrls: ['./board-display.component.css']
})
export class BoardDisplayComponent implements OnInit, OnChanges {
  @Output() clickLand = new EventEmitter<number>();
  @Output() clickSegment = new EventEmitter<number[]>();
  @Output() clickIntersection = new EventEmitter<number[]>();
  @Input() description: GameDescription;

  @ViewChild('catanBoard', {static: true}) catanBoard: ElementRef<HTMLCanvasElement>;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  landPositionList: LandPosition[];
  externalLandPositionList: LandPosition[];
  portList: Port[];

  landsFracHeight: number;
  landsFracWidth: number;
  thiefFracHeight: number;
  thiefFracWidth: number;
  catanBoardXCenter = 0.5;
  catanBoardYCenter = 0.5;

  private static updateClickedLands(singleClickedLands: number[],
                                    doubleClickedLands: number[],
                                    tripleClickedLands: number[],
                                    x: number, y: number,
                                    landX: number, landY: number,
                                    widthUnit: number, heightUnit: number,
                                    singleSquareDistThreshold: number,
                                    doubleSquareDistThreshold: number,
                                    tripleSquareDistThreshold: number,
                                    landNumber: number) {
    const landSquareDist = Math.pow((landX - x) / widthUnit, 2) + Math.pow((landY - y) / heightUnit, 2);

    if (landSquareDist < singleSquareDistThreshold) {
      singleClickedLands.push(landNumber);
    }
    if (landSquareDist < doubleSquareDistThreshold) {
      doubleClickedLands.push(landNumber);
    }
    if (landSquareDist < tripleSquareDistThreshold) {
      tripleClickedLands.push(landNumber);
    }
  }

  static getLandImagePath(landType: string) {
    return assetsPath.concat('/lands/').concat(landType).concat('.png');
  }

  static getPortImagePath(portName: string) {
    return assetsPath.concat('/ports/').concat(portName).concat('.png');
  }

  constructor() { }

  ngOnInit() {
    this.canvas = this.catanBoard.nativeElement;
    this.context = this.canvas.getContext('2d');

    if (this.description.extended) {
      this.landPositionList = extension344LandPositionList;
      this.externalLandPositionList = extension344ExternalLandPositionList;
      this.portList = extension344PortList;
    } else {
      this.landPositionList = classicLandPositionList;
      this.externalLandPositionList = classicExternalLandPositionList;
      this.portList = classicPortList;
    }

    let maxYFrac = 0;
    let maxXFrac = 0;
    for (const land of this.externalLandPositionList) {
      maxXFrac = Math.max(maxXFrac, Math.abs(land.widthFrac));
      maxYFrac = Math.max(maxYFrac, Math.abs(land.heightFrac));
    }

    const meanSizeHeightRatio = (this.canvas.height + this.canvas.width) / (2 * this.canvas.height);
    const meanSizeWidthRatio = (this.canvas.height + this.canvas.width) / (2 * this.canvas.width);
    this.landsFracHeight = Math.min(meanSizeHeightRatio / (2 * maxYFrac + 1),
                                    2 * meanSizeWidthRatio / (Math.sqrt(3) * (2 * maxXFrac + 1)));
    this.landsFracWidth = this.landsFracHeight * Math.sqrt(3) / 2;
    this.thiefFracHeight = this.landsFracHeight / 2;
    this.thiefFracWidth = 2 * this. thiefFracHeight / 3;

    this.drawFullCanvas(this.description);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.description.firstChange) {
      return;
    }

    const currentDescription: GameDescription = changes.description.currentValue;
    const previousDescription: GameDescription = changes.description.previousValue;

    // If thief position has changed we need to remove it and that means re-drawing full canvas.
    // It can be done more efficiently but I do not care.
    console.log('updating');
    if (previousDescription == null || currentDescription.thiefPosition !== previousDescription.thiefPosition) {
      console.log('drawing full canvas');
      this.drawFullCanvas(currentDescription, false);
    } else {
        console.log(previousDescription.plays.length);
        console.log(currentDescription.plays.length);
        // If no change was made on thief we just add the new plays.
        for (let i: number = previousDescription.plays.length; i < currentDescription.plays.length; i++) {
          console.log('drawing play');
          this.drawPlay(currentDescription.plays[i], this.context, this.canvas.height, this.canvas.width);
        }
    }
  }

  drawPlay(play: BuildPlay, ctx: CanvasRenderingContext2D, canvasHeight: number, canvasWidth: number) {
    // Make sure that play is a build play.
    if (play.playName !== 'build_road' && play.playName !== 'build_settlement' && play.playName !== 'build_city') {
      return;
    }

    // Get position where play should be placed.
    let cx = 0;
    let cy = 0;
    for (const index of play.position) {
      let land: LandPosition;
      if (index >= 0) {
        land = this.landPositionList[index];
      } else {
        land = this.externalLandPositionList[-index];
      }
      cx += land.widthFrac;
      cy += land.heightFrac;
    }
    cx /= play.position.length;
    cy /= play.position.length;

    const size = 0.03 * (canvasWidth + canvasHeight) / 2;
    ctx.beginPath();
    ctx.fillStyle = play.color;
    if (play.playName === 'build_road') {
      // Road is a rectangle.
      ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
    } else if (play.playName === 'build_settlement') {
      // Settlement is a circle.
      ctx.arc(cx - size / 2, cy - size / 2, size, 0, 2 * Math.PI, false);
      ctx.fill();
    } else if (play.playName === 'build_city') {
      // City is a rectangle on top of the circle that represents a settlement.
      ctx.fillRect(cx - 3 * size / 4, cy - 3 * size / 4, 3 * size / 2, 3 * size / 2);
    }
    ctx.stroke();
  }

  drawFullCanvas(gameDescription: GameDescription, drawPorts: boolean = true) {
    if (drawPorts) {
      this.resetCanvas(this.context, this.canvas.height, this.canvas.width);
      this.drawPorts(this.context, this.canvas.height, this.canvas.width);
    }
    this.drawLands(gameDescription.landList, this.context, this.canvas.height, this.canvas.width);
    this.drawThief(gameDescription.thiefPosition, gameDescription.landList, this.context, this.canvas.height, this.canvas.width);
    for (const play of gameDescription.plays) {
      this.drawPlay(play, this.context, this.canvas.height, this.canvas.width);
    }
  }

  resetCanvas(ctx: CanvasRenderingContext2D, canvasHeight: number, canvasWidth: number) {
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.stroke();
  }

  drawLands(landList: NumberedLand[], ctx: CanvasRenderingContext2D, canvasHeight: number, canvasWidth: number) {
    const meanSize = (canvasWidth + canvasHeight) / 2;
    const imgHeight = meanSize * this.landsFracHeight;
    const imgWidth = meanSize * this.landsFracWidth;

    for (let i = 0; i < landList.length; i++) {

      const landPosition = this.landPositionList[i];
      const land = landList[i];

      const cx = this.catanBoardXCenter * canvasWidth + landPosition.widthFrac * imgWidth;
      const cy = this.catanBoardYCenter * canvasHeight + landPosition.heightFrac * imgHeight;

      const image = new Image();

      image.src = BoardDisplayComponent.getLandImagePath(land.landType);
      image.onload = () => {
        ctx.drawImage(image, cx - imgWidth / 2, cy - imgHeight / 2, imgWidth, imgHeight);
        this.drawValue(ctx, land, cy, cx, canvasHeight, canvasWidth);
      };
    }
  }

  drawPorts(ctx: CanvasRenderingContext2D, canvasHeight: number, canvasWidth: number) {
    const meanSize = (canvasWidth + canvasHeight) / 2;
    const imgHeight = meanSize * this.landsFracHeight;
    const imgWidth = meanSize * this.landsFracWidth;

    for (const port of this.portList) {
      // draw the image since the context is rotated, the image will be rotated also
      const landPosition = this.externalLandPositionList[-port.externalLandPosition - 1];
      const cx = canvasWidth * this.catanBoardXCenter + landPosition.widthFrac * imgWidth;
      const cy = canvasHeight * this.catanBoardYCenter + landPosition.heightFrac * imgHeight;

      const image = new Image();

      image.src = BoardDisplayComponent.getPortImagePath(port.portName);
      image.onload = () => {
        ctx.setTransform(1, 0, 0, 1, cx, cy); // sets scales and origin
        ctx.rotate(-port.rotateRadians);

        ctx.drawImage(image, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
        ctx.setTransform();
      };
    }
  }

  drawThief(thiefPosition: number, landList: NumberedLand[], ctx: CanvasRenderingContext2D, canvasHeight: number, canvasWidth: number) {
    const meanSize = (canvasWidth + canvasHeight) / 2;
    const imgHeight = meanSize * this.thiefFracHeight;
    const landImgHeight = meanSize * this.landsFracHeight;
    const imgWidth = meanSize * this.thiefFracWidth;
    const landImgWidth = meanSize * this.landsFracWidth;
    const thiefLand = this.landPositionList[thiefPosition];
    const land = landList[thiefPosition];

    const cx = this.catanBoardXCenter * canvasWidth + thiefLand.widthFrac * landImgWidth;
    const cy = this.catanBoardYCenter * canvasHeight + thiefLand.heightFrac * landImgHeight;

    const image = new Image();

    image.src = assetsPath.concat('/thief.png');
    image.onload = () => {
      ctx.drawImage(image, cx - imgWidth / 2, cy - imgHeight / 2, imgWidth, imgHeight);
      this.drawValue(ctx, land, cy, cx, canvasHeight, canvasWidth);
    };
  }

  drawValue(ctx: CanvasRenderingContext2D, land: NumberedLand, cy: number, cx: number, canvasHeight: number, canvasWidth) {
    if (land.landType !== 'desert') {
      ctx.textAlign = 'center';
      ctx.font = this.getFontFromValue(land.value, canvasHeight, canvasWidth);
      ctx.fillStyle = this.getFillStyleFromValue(land.value);
      ctx.fillText(land.value.toString(), cx, cy);
    }
  }

  processClick(event: MouseEvent) {
    // Get mouse position relative to viewed canvas.
    const rect = this.canvas.getBoundingClientRect(); // abs. size of viewed canvas.

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    // Init lists of clicked lands.
    const singleClickedLands: number[] = [];
    const singleSquareDistThreshold = 1 / 36;
    const doubleClickedLands: number[] = [];
    const doubleSquareDistThreshold = 31 / 144;
    const tripleClickedLands: number[] = [];
    const tripleSquareDistThreshold = 4 / 9;

    // Get size of land images in order to obtain center of land.
    const meanSize = (this.canvas.width + this.canvas.height) / 2;
    const landImgHeight = meanSize * this.landsFracHeight;
    const landImgWidth = meanSize * this.landsFracWidth;
    const landFracWidth = landImgWidth / this.canvas.width;
    const landFracHeight = landImgHeight / this.canvas.height;
    const widthUnit = landImgHeight / this.canvas.width;
    const heightUnit = landImgHeight / this.canvas.height;

    // Iterate over all lands checking clicks.
    for (let i = 0; i < this.landPositionList.length; i++) {
      const land = this.landPositionList[i];
      const landX = this.catanBoardXCenter + land.widthFrac * landFracWidth;
      const landY = this.catanBoardYCenter + land.heightFrac * landFracHeight;
      BoardDisplayComponent.updateClickedLands(singleClickedLands,
                              doubleClickedLands,
                              tripleClickedLands,
                              x, y,
                              landX, landY,
                              widthUnit, heightUnit,
                              singleSquareDistThreshold,
                              doubleSquareDistThreshold,
                              tripleSquareDistThreshold,
                              i);
    }

    // Iterate over all extended lands checking clicks.
    for (let i = 0; i < this.externalLandPositionList.length; i++) {
      const land = this.externalLandPositionList[i];
      const landNumber = -i - 1;
      const landX = this.catanBoardXCenter + land.widthFrac * landFracWidth;
      const landY = this.catanBoardYCenter + land.heightFrac * landFracHeight;
      BoardDisplayComponent.updateClickedLands(singleClickedLands,
                              doubleClickedLands,
                              tripleClickedLands,
                              x, y,
                              landX, landY,
                              widthUnit, heightUnit,
                              singleSquareDistThreshold,
                              doubleSquareDistThreshold,
                              tripleSquareDistThreshold,
                              landNumber);
    }

    // Emit click events only one at a time.
    if (singleClickedLands.length === 1) {
      // If single clicked was successful we emit the result.
      this.clickLand.emit(singleClickedLands[0]);
    }
    if (doubleClickedLands.length === 2) {
      // If double clicked was successful we emit the result.
      this.clickSegment.emit(doubleClickedLands);
    }
    if (tripleClickedLands.length === 3) {
      // If double clicked was successful we emit the result.
      this.clickIntersection.emit(tripleClickedLands);
    }

  }

  getFontFromValue(value: number, canvasHeight: number, canvasWidth: number) {
    const meanSize = (canvasHeight + canvasWidth) / 2;
    if (value === 2 || value === 12) {
      return 'normal ' + Math.round(meanSize * 0.020).toString() + 'px Arial';
    } else if (value === 3 || value === 11) {
      return 'normal ' + Math.round(meanSize * 0.024).toString() + 'px Arial';
    } else if (value === 4 || value === 10) {
      return 'normal ' + Math.round(meanSize * 0.030).toString() + 'px Arial';
    } else if (value === 5 || value === 9) {
      return 'bold ' + Math.round(meanSize * 0.030).toString() + 'px Arial';
    } else if (value === 6 || value === 8) {
      return 'bold ' + Math.round(meanSize * 0.030).toString() + 'px Arial';
    }
  }

  getFillStyleFromValue(value: number) {
    if (value === 2 || value === 12) {
      return 'black';
    } else if (value === 3 || value === 11) {
      return 'black';
    } else if (value === 4 || value === 10) {
      return 'black';
    } else if (value === 5 || value === 9) {
      return 'black';
    } else if (value === 6 || value === 8) {
      return 'red';
    }
  }
}
