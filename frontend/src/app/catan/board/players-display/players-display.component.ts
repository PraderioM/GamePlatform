import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../../services/models';
import {assetsPath} from '../../services/constants';

@Component({
  selector: 'app-players-display',
  templateUrl: './players-display.component.html',
  styleUrls: ['./players-display.component.css']
})
export class PlayersDisplayComponent implements OnInit {
  @Input() players: Player[];
  @Input() knightPlayer?: Player;
  @Input() longRoadPlayer?: Player;
  @Input() currentPlayer: number;

  instructionsPath = assetsPath.concat('/special_cards/instructions.png');

  constructor() { }

  ngOnInit() {
  }

}
