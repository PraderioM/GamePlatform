import {Component, Input, OnInit} from '@angular/core';
import {StateService} from '../../../services/state.service';
import {ActiveGame} from '../../../services/models';

@Component({
  selector: 'app-active-games-board',
  templateUrl: './active-games-board.component.html',
  styleUrls: ['./active-games-board.component.css']
})
export class ActiveGamesBoardComponent implements OnInit {
  @Input() token: string;

  activeGames: ActiveGame[];

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.getActiveGames();
  }
  async getActiveGames() {
    this.activeGames = await this.stateService.getActiveGames(this.token);
  }

}
