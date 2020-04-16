import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../../../services/models';

@Component({
  selector: 'app-row-display',
  templateUrl: './row-display.component.html',
  styleUrls: ['./row-display.component.css']
})
export class RowDisplayComponent implements OnInit {
  @Input() description: GameDescription;
  @Input() index: number;
  @Output() makePlay = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  getColIndexes() {
    const indexes: number [] = [];
    for (let i = 0; i < this.description.cols; i++) {
      indexes.push(i);
    }
    return indexes;
  }

}
