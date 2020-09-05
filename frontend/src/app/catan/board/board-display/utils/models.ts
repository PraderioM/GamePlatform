export class LandPosition {
  constructor(public heightFrac: number, public widthFrac: number) {
  }
}

export class Port {
  constructor(public portName: string, public rotateRadians: number, public externalLandPosition: number) {
  }
}
