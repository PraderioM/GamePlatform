import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../../services/models';
import {StateService} from '../../services/state.service';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.css']
})
export class GameTableComponent implements OnInit {
  @Output() enterGame = new EventEmitter<GameDescription>();
  @Input() token: string;
  showActive = true;

  constructor(public stateService: StateService) { }

  ngOnInit() {
  }

  toggleShowed() {
    this.showActive = !this.showActive;
  }

  onEnterGame(gameDescription: GameDescription) {
    this.enterGame.emit(gameDescription);
  }

}
