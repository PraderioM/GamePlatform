import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../../services/models';

@Component({
  selector: 'app-players-display',
  templateUrl: './players-display.component.html',
  styleUrls: ['./players-display.component.css']
})
export class PlayersDisplayComponent implements OnInit {
  @Input() playerList: Player[];
  @Input() currentPlayerName: string;
  @Input() isDescriptionAvailable: boolean;
  @Input() isChoosingPhase: boolean;
  @Input() isResolutionPhase: boolean;
  @Input() goalPoints: number;

  constructor() { }

  ngOnInit(): void {
  }

  gameStarted(): boolean {
    for (const player of this.playerList) {
      if (player.name !== null) {
        return false;
      }
    }
    return true;
  }

}
