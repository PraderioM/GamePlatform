import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../../../../services/models';

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

  getSymbol() {
    let symbol = '';
    for (const play of this.description.plays) {
      if (play.row === this.rowIndex && play.col === this.colIndex) {
        symbol = play.symbol;
      }
    }
    return symbol;
  }

}
