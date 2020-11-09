import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActiveGame, GameDescription} from '../../../services/models';
import {StateService} from '../../../services/state.service';
import {selectionRefreshTime} from '../../../../services/constants';

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
    this.refreshActiveGames();
  }

  async refreshActiveGames() {
    this.activeGames = await this.stateService.getActiveGames(this.token);
    setTimeout(this.refreshActiveGames.bind(this), selectionRefreshTime);
  }

  async tryEnterGame(activeGame: ActiveGame) {
    const gameDescription = await this.stateService.enterGame(this.token, activeGame.gameId);
    if (gameDescription.id != null) {
      this.enterGame.emit(gameDescription);
    } else {
      alert(gameDescription.description);
    }
  }

}
