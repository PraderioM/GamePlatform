import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../../../services/models';

@Component({
  selector: 'app-player-display',
  templateUrl: './player-display.component.html',
  styleUrls: ['./player-display.component.css']
})
export class PlayerDisplayComponent implements OnInit {
  @Input() player: Player;
  @Input() selected = false;

  constructor() { }

  ngOnInit() {
  }

  getColor() {
    // Change by non-duplicate automatic generation of color.
    if (this.player.symbol === 't') {
      return '#ff0000';
    } else if (this.player.symbol === 'h') {
      return '#00ff00';
    } else if (this.player.symbol === 'e') {
      return '#0000ff';
    } else if (this.player.symbol === 'G') {
      return '#ffff00';
    } else if (this.player.symbol === 'A') {
      return '#ff00ff';
    } else if (this.player.symbol === 'M') {
      return '#00ffff';
    } else if (this.player.symbol === 'E') {
      return '#aa0000';
    }

    return '#000000';
  }

}
