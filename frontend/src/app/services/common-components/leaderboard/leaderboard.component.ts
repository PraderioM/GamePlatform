import {Component, Input, OnInit} from '@angular/core';
import {LeaderBoardPosition} from '../../models';

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
    this.getLeaderBoardPosition();
  }

  async getLeaderBoardPosition() {
    this.leaderBoardPositions = await this.stateService.getLeaderBoard(this.token);
  }

}
