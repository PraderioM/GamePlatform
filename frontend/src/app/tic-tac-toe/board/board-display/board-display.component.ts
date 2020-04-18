import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription, Play} from '../../services/models';

@Component({
  selector: 'app-board-display',
  templateUrl: './board-display.component.html',
  styleUrls: ['./board-display.component.css']
})
export class BoardDisplayComponent implements OnInit {
  @Output() makePlay = new EventEmitter<Play>();
  @Input() description: GameDescription;
  @Input() token: string;

  constructor() { }

  ngOnInit() {
  }

  newPlay(row: number, col: number) {
    for (const player of this.description.players) {
      if (player.token === this.token) {
        const play = new Play(row, col, player.symbol);
        this.makePlay.emit(play);
      }
    }
  }

  getRowIndexes() {
    const indexes: number [] = [];
    for (let i = 0; i < this.description.rows; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  getColIndexes() {
    const indexes: number [] = [];
    for (let i = 0; i < this.description.cols; i++) {
      indexes.push(i);
    }
    return indexes;
  }
}
