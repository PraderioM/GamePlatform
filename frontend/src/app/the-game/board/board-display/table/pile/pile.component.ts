import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pile',
  templateUrl: './pile.component.html',
  styleUrls: ['./pile.component.css']
})
export class PileComponent implements OnInit {
  @Output() playCard = new EventEmitter<void>();
  @Output() blockPile = new EventEmitter<void>();
  @Output() slowDownPile = new EventEmitter<void>();

  @Input() ascending: boolean;
  @Input() topCard: number;
  @Input() onFire: boolean;
  @Input() gameStarted: boolean;
  @Input() canPlayCard: boolean;
  @Input() canReservePile: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  getDirection() {
    if (this.ascending) {
      return 'ascending';
    } else {
      return 'descending';
    }
  }
}
