import {Component, Input, OnInit} from '@angular/core';
import {LeaderBoardPosition} from '../../../../services/models';

@Component({
  selector: 'app-leader-board-position-display',
  templateUrl: './leader-board-position-display.component.html',
  styleUrls: ['./leader-board-position-display.component.css']
})
export class LeaderBoardPositionDisplayComponent implements OnInit {
  @Input() leaderBoardPosition: LeaderBoardPosition;
  constructor() { }

  ngOnInit() {
  }

}
