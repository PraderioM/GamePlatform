import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActiveGame, GameDescription} from '../../../../services/models';
import {StateService} from '../../../../services/state.service';

@Component({
  selector: 'app-active-game-display',
  templateUrl: './active-game-display.component.html',
  styleUrls: ['./active-game-display.component.css']
})
export class ActiveGameDisplayComponent implements OnInit {
  @Output() enterGame = new EventEmitter<GameDescription>();
  @Input() token: string;
  @Input() activeGame: ActiveGame;

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  async tryEnterGame() {
    const gameDescription = await this.stateService.findGame(this.token, this.activeGame.gameId);
    if (gameDescription.id != null) {
      this.enterGame.emit(gameDescription);
    } else {
      alert(gameDescription.description);
    }
  }

}
