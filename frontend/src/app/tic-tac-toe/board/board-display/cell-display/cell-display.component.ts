import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../../../services/models';

@Component({
  selector: 'app-cell-display',
  templateUrl: './cell-display.component.html',
  styleUrls: ['./cell-display.component.css']
})
export class CellDisplayComponent implements OnInit {
  @Input() description: GameDescription;
  @Input() rowIndex: number;
  @Input() colIndex: number;
  @Output() makePlay = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  isLastPlay() {
    let playIndex = 0;
    for (const play of this.description.plays) {
      playIndex += 1;
      if (play.row === this.rowIndex && play.col === this.colIndex) {
        return playIndex === this.description.plays.length;
      }
    }
    return false;
  }

  getSymbol() {
    for (const play of this.description.plays) {
      if (play.row === this.rowIndex && play.col === this.colIndex) {
        return play.symbol;
      }
    }
    return '';
  }

  getColor() {
    const symbol = this.getSymbol();
    if (symbol === '') {
      return '#555555';
    }

    // Todo generate color automatically.
    if (symbol === 't') {
      return '#ff0000';
    } else if (symbol === 'h') {
      return '#00ff00';
    } else if (symbol === 'e') {
      return '#0000ff';
    } else if (symbol === 'G') {
      return '#ffff00';
    } else if (symbol === 'A') {
      return '#ff00ff';
    } else if (symbol === 'M') {
      return '#00ffff';
    } else if (symbol === 'E') {
      return '#aa0000';
    }

    return '#ffffff';
  }

}
