import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActiveGame, GameDescription} from '../../../services/models';
import {StateService} from '../../../services/state.service';

@Component({
  selector: 'app-active-games-board',
  templateUrl: './active-games-board.component.html',
  styleUrls: ['./active-games-board.component.css']
})
export class ActiveGamesBoardComponent implements OnInit {
  @Input() token: string;
  @Output() enterGame = new EventEmitter<GameDescription>();

  activeGames: ActiveGame[];

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.getActiveGames();
  }

  async getActiveGames() {
    this.activeGames = await this.stateService.getActiveGames(this.token);
  }

  async tryEnterGame(activeGame: ActiveGame) {
    const gameDescription = await this.stateService.findGame(this.token, activeGame.gameId);
    if (gameDescription.id != null) {
      this.enterGame.emit(gameDescription);
    } else {
      alert(gameDescription.description);
    }
  }

}
