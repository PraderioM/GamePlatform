import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription, Play} from '../../services/models';
import {modifierList} from '../../services/constants';
import {getModifierImage, getPlayImage, getPlayName} from '../../services/utils';

@Component({
  selector: 'app-board-display',
  templateUrl: './board-display.component.html',
  styleUrls: ['./board-display.component.css', '../../../services/common.styles.css']
})
export class BoardDisplayComponent implements OnInit {
  @Output() makePlay = new EventEmitter<Play>();
  @Input() token: string;
  @Input() name: string;
  @Input() description: GameDescription;

  selectedPlay: number;
  selectedModifier: string;

  constructor() { }

  ngOnInit(): void {
  }

  getPossiblePlays(): number[] {
    const possiblePlays: number[] = [];
    if (this.description.playMode === 'SMBC') {
      possiblePlays.push(0);
    }

    for (let i = 0; i < this.description.nPlays; i++) {
      possiblePlays.push(i + 1);
    }
    return possiblePlays;
  }

  selectPlay(play: number) {
    this.selectedPlay = play;
  }

  selectModifier(modifier: string) {
    this.selectedModifier = modifier;
  }

  getPossibleModifiers() {
    return modifierList;
  }

  onMakePlay() {
    if (this.selectedPlay == null) {
      alert('Please select a play.');
      return;
    } else if (this.selectedPlay === 0 && this.description.currentRound === 0) {
      alert('Time machine cannot be played on first round.');
      return;
    } else if (this.description.playMode === 'SMBC' && this.selectedModifier == null) {
      alert('Please select a modifier.');
      return;
    }

    this.makePlay.emit(new Play(this.selectedPlay, this.selectedModifier));
  }

  getPlayImgPath(play: number) {
    return getPlayImage(play);
  }

  getPlayName(play: number) {
    return getPlayName(play);
  }

  getModifierImgPath(modifier: string) {
    return getModifierImage(modifier);
  }

  getPlayNgClass(play: number) {
    return {
      play: true,
      selected: this.selectedPlay === play
    };
  }

  getModifierNgClass(modifier: string) {
    return {
      play: true,
      selected: this.selectedModifier === modifier
    };
  }
}
