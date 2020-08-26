import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../../../services/models';
import {assetsPath} from '../../../services/constants';

@Component({
  selector: 'app-player-display',
  templateUrl: './player-display.component.html',
  styleUrls: ['./player-display.component.css']
})
export class PlayerDisplayComponent implements OnInit {
  @Input() player: Player;
  @Input() hasArmy: boolean;
  @Input() hasCommercialRoute: boolean;
  @Input() selected = false;

  armyURL = assetsPath.concat('/special_cards/army.png');
  routeURL = assetsPath.concat('/special_cards/commercial_route.png');
  boldText: string;
  plainText: string;

  constructor() { }

  ngOnInit() {
    const playerName = this.player.name == null ? '' : this.player.name;
    const showText = playerName + ' (' + this.player.points + ')';
    if (this.selected) {
      this.boldText = showText;
      this.plainText = '';
    } else {
      this.boldText = '';
      this.plainText = showText;
    }
  }

}
