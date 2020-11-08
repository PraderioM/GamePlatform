import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {getCardPath} from '../../../../services/utils';


export class ImageData {
  cardID: number;
  imageSet: string;
}

@Component({
  selector: 'app-card-dialog',
  templateUrl: './card-dialog.component.html',
  styleUrls: ['./card-dialog.component.css']
})
export class CardDialogComponent implements OnInit {
  @Input() cardID: number;
  @Input() imageSet: string;

  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
  }

  getCardPath(): string {
    return getCardPath(this.cardID, this.imageSet);
  }
}
