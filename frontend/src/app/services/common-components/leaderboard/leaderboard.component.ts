import {Component, Input, OnInit} from '@angular/core';
import {LeaderBoardPosition} from '../../models';
import {selectionRefreshTime} from '../../constants';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  @Input() token: string;
  @Input() stateService: any;

  leaderBoardPositions: LeaderBoardPosition[];

  constructor() { }

  ngOnInit() {
    this.refreshLeaderBoardPosition();
  }

  async refreshLeaderBoardPosition() {
    this.leaderBoardPositions = await this.stateService.getLeaderBoard(this.token);
    setTimeout(this.refreshLeaderBoardPosition.bind(this), selectionRefreshTime);
  }

}
