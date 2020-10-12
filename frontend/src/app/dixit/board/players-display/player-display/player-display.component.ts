import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-player-display',
  templateUrl: './player-display.component.html',
  styleUrls: ['./player-display.component.css']
})
export class PlayerDisplayComponent implements OnInit, OnChanges {
  @Input() name: string;
  @Input() isCurrent: boolean;
  @Input() hasChosen: boolean;
  @Input() hasPlayedCard: boolean;
  @Input() points: number;
  @Input() goalPoints: number;
  @Input() isDescriptionAvailable: boolean;
  @Input() isChoosingPhase: boolean;
  @Input() isResolutionPhase: boolean;

  describingMessage = 'is thinking';
  describedMessage = this.isChoosingPhase ? 'is waiting' : '';
  playingCardMessage = 'is thinking';
  playedCardMessage = 'looks impatiently at you to make you nervous';
  choosingCardMessage = 'is thinking';
  chosenCardMessage = 'is praying for you to pick his card';
  waitingForDescription = 'thinks you should have chosen your description earlier';
  previousPoints: number;
  victoryExclamation = 'initiating victory dance';
  notLostExclamation = 'it\' something';
  lostExclamation = 'the important thing is to participate';
  itIsImpossibleToBeThisBadExclamation = 'WTF?';

  constructor() { }

  ngOnInit(): void {
    this.describedMessage = this.isChoosingPhase ? 'yells at you to pick the other card' : 'hopes that only one of you has a decent card';
    this.previousPoints = this.points;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.points.firstChange) {
      return;
    }

    this.previousPoints = changes.points.previousValue;
  }

}
