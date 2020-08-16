import {Component, Input, OnInit} from '@angular/core';
import {LeaderBoardPosition} from '../../../../services/models';
import {StateService} from '../../../services/state.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  @Input() token: string;

  leaderBoardPositions: LeaderBoardPosition[];

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.getLeaderBoardPosition();
  }

  async getLeaderBoardPosition() {
    this.leaderBoardPositions = await this.stateService.getLeaderBoard(this.token);
  }

}
