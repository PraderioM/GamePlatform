import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../../../services/models';
import {getPlayImage, getPlayName} from '../../../services/utils';

@Component({
  selector: 'app-player-display',
  templateUrl: './player-display.component.html',
  styleUrls: ['./player-display.component.css', '../../../../services/common.styles.css']
})
export class PlayerDisplayComponent implements OnInit {
  @Input() player: Player;
  @Input() currentRound: number;
  @Input() showPoints: boolean;
  @Input() showImaginaryPoints: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  getNgClass() {
    return {
      'bold-paragraph': this.player.isActive
    };
  }

  getReadyStatus(): string {
    if (this.player.isActive) {
      if (this.hasPlayed()) {
        return 'is ready';
      } else {
        return 'is thinking';
      }
    } else {
      return 'is loser';
    }
  }

  hasPlayed() {
    return this.player.isActive && this.player.lastPlayedRound === this.currentRound;
  }

  getLastPlayName() {
    if (this.hasPlayed()) {
      getPlayName(this.player.lastPlay);
    } else {
      getPlayName(this.player.currentPlay);
    }
  }

  getLastPlayImage() {
    if (this.hasPlayed()) {
      getPlayImage(this.player.lastPlay);
    } else {
      getPlayImage(this.player.currentPlay);
    }
  }

  getPoints(): string {
    if (this.showPoints) {
      let outStr = 'points: ' + this.player.points.toString();
      if (this.showImaginaryPoints) {
        outStr = outStr + ' i points: ' + this.player.imaginaryPoints.toString();
      }
      return outStr;
    } else {
      return '';
    }
  }
}
