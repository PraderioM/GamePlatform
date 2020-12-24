import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../../services/models';

@Component({
  selector: 'app-players-display',
  templateUrl: './players-display.component.html',
  styleUrls: ['./players-display.component.css']
})
export class PlayersDisplayComponent implements OnInit {
  @Input() playerList: Player[];
  @Input() currentPlayerName: string;
  @Input() gameStarted: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
