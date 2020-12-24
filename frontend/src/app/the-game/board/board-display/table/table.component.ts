import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Pile, PileReserve} from '../../../services/models';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Output() startGame = new EventEmitter<void>();
  @Output() playCard = new EventEmitter<number>();
  @Output() blockPile = new EventEmitter<number>();
  @Output() slowDownPile = new EventEmitter<number>();
  @Output() endTurn = new EventEmitter<void>();

  @Input() piles: Pile[];
  @Input() blockedPiles: PileReserve[];
  @Input() slowedDownPiles: PileReserve[];
  @Input() gameStarted: boolean;
  @Input() isCurrentPlayer: boolean;
  @Input() onFire: boolean;
  @Input() canPlayCard: boolean;
  @Input() canReservePile: boolean;
  @Input() canEndTurn: boolean;
  @Input() nRemainingCards: number;

  constructor() { }

  ngOnInit(): void {
  }

}
