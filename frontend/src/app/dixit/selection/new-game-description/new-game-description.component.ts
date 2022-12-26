import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../../services/models';
import {StateService} from '../../services/state.service';
import {deckSize} from '../../services/constants';
import {nCards} from '../../services/cards';

@Component({
  selector: 'app-new-game-description',
  templateUrl: './new-game-description.component.html',
  styleUrls: ['./new-game-description.component.css']
})
export class NewGameDescriptionComponent implements OnInit {
  @Output() enterGame = new EventEmitter<GameDescription>();
  @Output() back = new EventEmitter<void>();
  @Input() token: string;

  imageSetList = getDictKeys(nCards);
  isNPCCorrect = true;
  isPCCorrect = true;
  isNPlaysCorrect = true;
  isTotalPointsCorrect = true;

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
  }

  resetCorrectValues(): void {
    this.isNPCCorrect = true;
    this.isPCCorrect = true;
    this.isNPlaysCorrect = true;
    this.isTotalPointsCorrect = true;
  }

  async tryCreateGame(npc: number, pc: number, totalPoints: number, imageSet: string): Promise<void> {
    this.resetCorrectValues();

    // Check that inputs are correct.
    if (isNaN(npc)) {
      alert('Number of non player characters must be a valid integer.');
      this.isNPCCorrect = false;
      return;
    } else if (npc < 0) {
      alert('Number of non player characters must be non negative.');
      this.isNPCCorrect = false;
      return;
    } else if (!Number.isInteger(npc)) {
      alert('Number of non player characters must be an integer.');
      this.isNPCCorrect = false;
      return;
    } else if (isNaN(pc)) {
      alert('Number of players must be a valid integer.');
      this.isPCCorrect = false;
      return;
    } else if (pc < 0) {
      alert('Number of players must be non negative.');
      this.isPCCorrect = false;
      return;
    } else if (!Number.isInteger(pc)) {
      alert('Number of players must be an integer.');
      this.isPCCorrect = false;
      return;
    } else if (pc + npc < 3) {
      alert('The total number of players must be at least 3.');
      this.isPCCorrect = false;
      this.isNPCCorrect = false;
      return;
    } else if (totalPoints < 1) {
      alert('Number of goal points must be at least 1.');
      this.isTotalPointsCorrect = false;
      return;
    } else if (!Number.isInteger(totalPoints)) {
      alert('Number of total points must be an integer.');
      this.isTotalPointsCorrect = false;
      return;
    } else if (nCards[imageSet] < (npc + pc ) * deckSize) {
      const n = Math.floor(nCards[imageSet] / deckSize).toString();
      alert('There can be at most ' + n + ' for playing with the image set ' + imageSet);
      this.isPCCorrect = false;
      this.isNPCCorrect = false;
    }

    const gameDescription = await this.stateService.createGame(this.token, npc, pc, totalPoints, imageSet);
    if (gameDescription.id != null) {
      this.enterGame.emit(gameDescription);
    } else {
      alert(gameDescription.description);
    }
  }

  getNPCClass(): object {
    return {
      'number-input': true,
      'error-input': !this.isNPCCorrect
    };
  }

  getPCClass(): object {
    return {
      'number-input': true,
      'error-input': !this.isPCCorrect
    };
  }

  getTotalPointsClass(): object {
    return {
      'number-input': true,
      'error-input': !this.isTotalPointsCorrect
    };
  }

}

function getDictKeys(inDict: object): string[] {
  const outList: string[] = [];

  for (const key of Object.keys(inDict)) {
    outList.push(key);
  }
  return outList;
}
