import {Component, Input, OnInit} from '@angular/core';
import {LeaderBoardPosition} from '../../../../services/models';

@Component({
  selector: 'app-leader-board-position-display',
  templateUrl: './leader-board-row-display.component.html',
  styleUrls: ['./leader-board-row-display.component.css']
})
export class LeaderBoardRowDisplayComponent implements OnInit {
  @Input() leaderBoardPosition: LeaderBoardPosition;
  constructor() { }

  ngOnInit() {
  }

}
