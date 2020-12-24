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

  @Input() name: string;
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

  canBlockPile(pileID: number) {
    if (!this.canReservePile) {
      return false;
    }

    const blockingPlayerList = this.getBlockingPLayerNames(pileID);
    for (const playerName of blockingPlayerList) {
      if (playerName === this.name) {
        return false;
      }
    }
    return true;
  }

  canSlowDownPile(pileID: number) {
    if (!this.canReservePile) {
      return false;
    }

    const slowingDownPlayerList = this.getSlowingDownPLayerNames(pileID);
    for (const playerName of slowingDownPlayerList) {
      if (playerName === this.name) {
        return false;
      }
    }
    return true;
  }

  getBlockingPLayerNames(pileId: number) {
    const nameList: string[] = [];
    for (const blockedPile of this.blockedPiles) {
      if (blockedPile.pileId === pileId) {
        nameList.push(blockedPile.name);
      }
    }
    return nameList;
  }

  getSlowingDownPLayerNames(pileId: number) {
    const nameList: string[] = [];
    for (const slowedDownPile of this.slowedDownPiles) {
      if (slowedDownPile.pileId === pileId) {
        nameList.push(slowedDownPile.name);
      }
    }
    return nameList;
  }
}
