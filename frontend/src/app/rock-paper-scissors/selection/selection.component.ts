import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../services/models';
import {StateService} from '../services/state.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  @Output() enterGame = new EventEmitter<GameDescription>();
  @Output() backToGameSelection = new EventEmitter<void>();
  @Input() token: string;

  gameCreationMode = false;
  gameFindingMode = false;

  constructor(public stateService: StateService) { }

  ngOnInit() {
  }

  onEnterGame(gameDescription: GameDescription) {
    this.enterGame.emit(gameDescription);
  }

  onEnterGameCreation() {
    this.gameFindingMode = false;
    this.gameCreationMode = true;
  }

  onEnterGameFinding() {
    this.gameFindingMode = true;
    this.gameCreationMode = false;
  }

  onEnterSelectionMode() {
    this.gameFindingMode = false;
    this.gameCreationMode = false;
  }

  onBackToGameSelection() {
    this.backToGameSelection.emit();
  }
}
