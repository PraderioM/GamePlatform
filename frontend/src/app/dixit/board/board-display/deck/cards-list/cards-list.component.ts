import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {nCards} from '../../../../services/constants';
import {getCardPath} from '../../../../services/utils';

@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.css', '../../board-display.component.css', '../../../../../services/common.styles.css']
})
export class CardsListComponent implements OnInit {
  @Output() back = new EventEmitter<void>();
  @Input() imageSet: string;

  offset = 0;
  limit = 6;

  constructor() { }

  ngOnInit(): void {
  }

  showPrevious() {
    this.offset = Math.max(0, this.offset - this.limit);
  }

  showNext() {
    const maxVal = Math.floor((nCards[this.imageSet] - 1) / this.limit) * this.limit;
    this.offset = Math.min(maxVal, this.offset + this.limit);
  }

  getCardPath(cardID: any) {
    return getCardPath(cardID, this.imageSet);
  }

  getCardIDs(): number[] {
    const cardIDs: number[] = [];
    for (let i = this.limit; i < Math.min(this.limit + this.offset, nCards[this.imageSet]); i++) {
      cardIDs.push(i);
    }
    return cardIDs;
  }
}
