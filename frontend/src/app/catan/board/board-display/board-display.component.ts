import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {GameDescription} from '../../services/models';
import {assetsPath} from '../../services/constants';
import {BuildPlay} from '../../services/plays/build';


class LandPosition {
  constructor(public heightFrac: number, public widthFrac: number) {
  }
}


class Port {
  constructor(public portName: string, public rotateRadians: number, public heightFrac: number, public widthFrac: number) {
  }
}

const originalPortList = [new Port('port_brick', 2 * Math.PI / 3, 0.5, 0.5)];
// Todo write real port position.
const originalLandPositionList = [
  new LandPosition(0., 0.),
  new LandPosition(0., 0.1),
  new LandPosition(0., 0.2),
  new LandPosition(0., 0.3),
  new LandPosition(0., 0.4),
  new LandPosition(0., 0.5),
  new LandPosition(0., 0.6),
  new LandPosition(0., 0.7),
  new LandPosition(0., 0.8),
  new LandPosition(0., 0.9),
  new LandPosition(0.1, 0.0),
  new LandPosition(0.1, 0.1),
  new LandPosition(0.1, 0.2),
  new LandPosition(0.1, 0.3),
  new LandPosition(0.1, 0.4),
  new LandPosition(0.1, 0.5),
  new LandPosition(0.1, 0.6),
  new LandPosition(0.1, 0.7),
  new LandPosition(0.1, 0.8),
];
const originalExternalLandPositionList = [
  new LandPosition(0., 0.),
  new LandPosition(0., 0.1),
  new LandPosition(0., 0.2),
  new LandPosition(0., 0.3),
  new LandPosition(0., 0.4),
  new LandPosition(0., 0.5),
  new LandPosition(0., 0.6),
  new LandPosition(0., 0.7),
  new LandPosition(0., 0.8),
  new LandPosition(0., 0.9),
  new LandPosition(0.1, 0.0),
  new LandPosition(0.1, 0.1),
  new LandPosition(0.1, 0.2),
  new LandPosition(0.1, 0.3),
  new LandPosition(0.1, 0.4),
  new LandPosition(0.1, 0.5),
  new LandPosition(0.1, 0.6),
  new LandPosition(0.1, 0.7),
  new LandPosition(0.1, 0.8),
];
const originalValueList = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];

// Todo write real port position.
const extendedPortList = [new Port('port_stone', 4 * Math.PI / 3, 0.5, 0.5)];
const extendedLandPositionList = [
  new LandPosition(0., 0.),
  new LandPosition(0., 0.1),
  new LandPosition(0., 0.2),
  new LandPosition(0., 0.3),
  new LandPosition(0., 0.4),
  new LandPosition(0., 0.5),
  new LandPosition(0., 0.6),
  new LandPosition(0., 0.7),
  new LandPosition(0., 0.8),
  new LandPosition(0., 0.9),
  new LandPosition(0.1, 0.0),
  new LandPosition(0.1, 0.1),
  new LandPosition(0.1, 0.2),
  new LandPosition(0.1, 0.3),
  new LandPosition(0.1, 0.4),
  new LandPosition(0.1, 0.5),
  new LandPosition(0.1, 0.6),
  new LandPosition(0.1, 0.7),
  new LandPosition(0.1, 0.8),
  new LandPosition(0.1, 0.9),
  new LandPosition(0.2, 0.0),
  new LandPosition(0.2, 0.1),
  new LandPosition(0.2, 0.2),
  new LandPosition(0.2, 0.3),
  new LandPosition(0.2, 0.4),
  new LandPosition(0.2, 0.5),
  new LandPosition(0.2, 0.6),
  new LandPosition(0.2, 0.7),
];
const extendedExternalLandPositionList = [
  new LandPosition(0., 0.),
  new LandPosition(0., 0.1),
  new LandPosition(0., 0.2),
  new LandPosition(0., 0.3),
  new LandPosition(0., 0.4),
  new LandPosition(0., 0.5),
  new LandPosition(0., 0.6),
  new LandPosition(0., 0.7),
  new LandPosition(0., 0.8),
  new LandPosition(0., 0.9),
  new LandPosition(0.1, 0.0),
  new LandPosition(0.1, 0.1),
  new LandPosition(0.1, 0.2),
  new LandPosition(0.1, 0.3),
  new LandPosition(0.1, 0.4),
  new LandPosition(0.1, 0.5),
  new LandPosition(0.1, 0.6),
  new LandPosition(0.1, 0.7),
  new LandPosition(0.1, 0.8),
  new LandPosition(0.1, 0.9),
  new LandPosition(0.2, 0.0),
  new LandPosition(0.2, 0.1),
  new LandPosition(0.2, 0.2),
  new LandPosition(0.2, 0.3),
  new LandPosition(0.2, 0.4),
  new LandPosition(0.2, 0.5),
  new LandPosition(0.2, 0.6),
  new LandPosition(0.2, 0.7),
];
const extendedValueList = [2, 5, 4, 6, 3, 9, 8, 11, 11, 10, 6, 3, 8, 4, 8, 10, 11, 12, 10, 5, 4, 9, 5, 9, 12, 3, 12, 6];

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

  @ViewChild('canvas', {static: false})
  canvas: ElementRef<HTMLCanvasElement>;
  landPositionList: LandPosition[];
  externalLandPositionList: LandPosition[];
  portList: Port[];
  valueList: number[];

  landsFracSize = 0.1;
  portsFracSize = this.landsFracSize / 2;
  thiefFracSize = 0.09;

  constructor() {
    if (this.description.extended) {
      this.landPositionList = originalLandPositionList;
      this.externalLandPositionList = originalExternalLandPositionList;
      this.portList = originalPortList;
      this.valueList = originalValueList;
    } else {
      this.landPositionList = extendedLandPositionList;
      this.externalLandPositionList = extendedExternalLandPositionList;
      this.portList = extendedPortList;
      this.valueList = extendedValueList;
    }
  }

  ngOnInit() {
    this.drawFullCanvas(this.description);
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentDescription: GameDescription = changes.description.currentValue;
    const previousDescription: GameDescription = changes.description.previousValue;

    // If thief position has changed we need to remove it and that means re-drawing full canvas.
    // It can be done more efficiently but I do not care.
    if (currentDescription.thiefPosition !== previousDescription.thiefPosition) {
      this.drawFullCanvas(currentDescription, false);
    } else {
        const canvas = this.canvas.nativeElement;
        const ctx = canvas.getContext('2d');

        // If no change was made on thief we just add the new plays.
        for (let i: number = previousDescription.plays.length; i < currentDescription.plays.length; i++) {
          this.drawPlay(currentDescription.plays[i], ctx, canvas.height, canvas.width);
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
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (drawPorts) {
      this.resetCanvas(ctx, canvas.height, canvas.width);
      this.drawPorts(ctx, canvas.height, canvas.width);
    }
    this.drawLands(gameDescription.landList, ctx, canvas.height, canvas.width);
    this.drawThief(gameDescription.thiefPosition, ctx, canvas.height, canvas.width);
    this.drawValues(gameDescription.thiefPosition, ctx, canvas.height, canvas.width);
    for (const play of gameDescription.plays) {
      this.drawPlay(play, ctx, canvas.height, canvas.width);
    }
  }

  resetCanvas(ctx: CanvasRenderingContext2D, canvasHeight: number, canvasWidth: number) {
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.stroke();
  }

  drawLands(landList: string[], ctx: CanvasRenderingContext2D, canvasHeight: number, canvasWidth: number) {
    const meanSize = (canvasWidth + canvasHeight) / 2;
    const imgHeight = meanSize * this.landsFracSize;
    const imgWidth = meanSize * this.landsFracSize;

    for (let i = 0; i < landList.length; i++) {
      const image = new Image();
      image.src = this.getLandURL(landList[i]);

      const landPosition = this.landPositionList[i];
      ctx.drawImage(image,
                canvasWidth * landPosition.widthFrac - imgWidth, canvasHeight * landPosition.heightFrac - imgHeight,
                    imgWidth, imgHeight);
    }
  }

  drawPorts(ctx: CanvasRenderingContext2D, canvasHeight: number, canvasWidth: number) {
    const meanSize = (canvasWidth + canvasHeight) / 2;
    const imgHeight = meanSize * this.portsFracSize;
    const imgWidth = meanSize * this.portsFracSize;

    for (const port of this.portList) {
      ctx.save();

      // move to the center of the canvas
      ctx.translate(canvasWidth / 2, canvasHeight / 2);

      // rotate the canvas to the specified degrees
      ctx.rotate(-port.rotateRadians);

      // draw the image since the context is rotated, the image will be rotated also
      const image = new Image();
      image.src = this.getPortURL(port.portName);
      ctx.drawImage(image, port.widthFrac - imgWidth / 2, port.heightFrac - imgHeight / 2, imgWidth, imgHeight);

      // we’re done with the rotating so restore the un-rotated context
      ctx.restore();
    }
  }

  drawThief(thiefPosition: number, ctx: CanvasRenderingContext2D, canvasHeight: number, canvasWidth: number) {
    const meanSize = (canvasWidth + canvasHeight) / 2;
    const imgHeight = meanSize * this.thiefFracSize;
    const imgWidth = meanSize * this.thiefFracSize;
    const desert = this.landPositionList[thiefPosition];
    const image = new Image();
    image.src = assetsPath.concat('/thief.png');
    ctx.drawImage(image,
        canvasWidth * desert.widthFrac - imgWidth, canvasHeight * desert.heightFrac - imgHeight,
        imgWidth, imgHeight);
  }

  drawValues(thiefPosition: number, ctx: CanvasRenderingContext2D, canvasHeight: number, canvasWidth: number) {
    ctx.textAlign = 'center';
    for (let i = 0; i < this.landPositionList.length; i++) {
      // Skip desert.
      if (i === thiefPosition) {
        continue;
      }

      // Get land and value associated to it.
      const landPosition = this.landPositionList[i];
      let value: number;
      // After thief we must go back by one in the valueList since we have skipped one value.
      if (thiefPosition < i) {
        value = this.valueList[i - 1];
      } else {
        value = this.valueList[i];
      }

      // Actual drawing of value.
      ctx.font = this.getFontFromValue(value, canvasHeight, canvasWidth);
      ctx.fillStyle = this.getFillStyleFromValue(value);
      ctx.fillText(value.toString(), canvasWidth * landPosition.widthFrac, canvasHeight * landPosition.heightFrac);
    }
  }

  processClick(input) {
    // Todo implement.
    console.log(input);
  }

  getLandURL(landName: string) {
    return assetsPath.concat('/lands/').concat(landName).concat('.png');
  }

  getPortURL(portName: string) {
    return assetsPath.concat('/ports/').concat(portName).concat('.png');
  }

  getFontFromValue(value: number, canvasHeight: number, canvasWidth: number) {
    const meanSize = (canvasHeight + canvasWidth) / 2;
    if (value === 2 || value === 12) {
      return 'normal ' + Math.round(meanSize * 0.010).toString() + 'px Arial';
    } else if (value === 3 || value === 11) {
      return 'normal ' + Math.round(meanSize * 0.012).toString() + 'px Arial';
    } else if (value === 4 || value === 10) {
      return 'normal ' + Math.round(meanSize * 0.015).toString() + 'px Arial';
    } else if (value === 5 || value === 9) {
      return 'bold ' + Math.round(meanSize * 0.015).toString() + 'px Arial';
    } else if (value === 6 || value === 8) {
      return 'bold ' + Math.round(meanSize * 0.015).toString() + 'px Arial';
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
