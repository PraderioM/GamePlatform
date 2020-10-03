import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Player} from '../../../services/models';
import {assetsPath} from '../../../services/constants';

@Component({
  selector: 'app-player-display',
  templateUrl: './player-display.component.html',
  styleUrls: ['./player-display.component.css']
})
export class PlayerDisplayComponent implements OnInit, OnChanges {
  @Input() player: Player;
  @Input() hasArmy: boolean;
  @Input() hasCommercialRoute: boolean;
  @Input() selected = false;

  armyURL = assetsPath.concat('/special_cards/army.png');
  routeURL = assetsPath.concat('/special_cards/commercial_route.png');
  boldText: string;
  plainText: string;

  previousValues = {points: 0, resources: 0, developments: 0, knights: 0};

  constructor() { }

  ngOnInit() {
    const playerName = this.player.name == null ? '' : this.player.name;

    // Get string.
    // points.
    const points = this.player.points;
    let showText = playerName + ' p:' + points;
    showText = showText + this.getChangeString(points, this.previousValues.points);

    // resources.
    const resources = this.player.materialsDeck.getNMaterials();
    showText = showText + ' r:' + resources;
    showText = showText + this.getChangeString(resources, this.previousValues.resources);

    // Development.
    const developments = this.player.developmentDeck.getNDevelopments();
    showText = showText + ' d:' + developments;
    showText = showText + this.getChangeString(developments, this.previousValues.developments);

    // Knights.
    const knights = this.player.nPlayedKnights;
    showText = showText + ' k:' + knights;
    showText = showText + this.getChangeString(knights, this.previousValues.knights);


    // Place it in bold or normal text depending on turn.
    if (this.selected) {
      this.boldText = showText;
      this.plainText = '';
    } else {
      this.boldText = '';
      this.plainText = showText;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.player.firstChange) {
      return;
    }

    const previousPlayer: Player = changes.developmentDeck.previousValue;

    // If draw differently values that have changed.
    if (previousPlayer != null) {
      this.previousValues.points = previousPlayer.points;
      this.previousValues.resources = previousPlayer.materialsDeck.getNMaterials();
      this.previousValues.developments = previousPlayer.developmentDeck.getNDevelopments();
      this.previousValues.knights = previousPlayer.nPlayedKnights;
    }
  }

  getChangeString(newVal: number, oldVal: number): string {
  if (newVal > oldVal) {
    return '(+' + (newVal - oldVal) + ')';
} else if (newVal < oldVal) {
    return '(-' + (oldVal - newVal) + ')';
  } else {
    return '';
  }
}

}
