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
  @Input() nActions: number;

  armyURL = assetsPath.concat('/special_cards/army.png');
  routeURL = assetsPath.concat('/special_cards/commercial_route.png');
  boldText: string;
  plainText: string;

  valueDifferences = {points: 0, resources: 0, developments: 0, knights: 0};
  lastUpdatedValues = {points: -2, resources: -2, developments: -2, knights: -2};

  constructor() { }

  ngOnInit(): void {
    const playerName = this.player.name == null ? '' : this.player.name;

    // Get string.
    // points.
    let showText = playerName + ' p:' + this.player.points;
    showText = showText + this.getChangeString(this.valueDifferences.points, this.lastUpdatedValues.points);

    // resources.
    showText = showText + ' r:' + this.player.materialsDeck.getNMaterials();
    showText = showText + this.getChangeString(this.valueDifferences.resources, this.lastUpdatedValues.resources);

    // Development.
    showText = showText + ' d:' + this.player.developmentDeck.getNDevelopments();
    showText = showText + this.getChangeString(this.valueDifferences.developments, this.lastUpdatedValues.developments);

    // Knights.
    showText = showText + ' k:' + this.player.nPlayedKnights;
    showText = showText + this.getChangeString(this.valueDifferences.knights, this.lastUpdatedValues.knights);


    // Place it in bold or normal text depending on turn.
    if (this.selected) {
      this.boldText = showText;
      this.plainText = '';
    } else {
      this.boldText = '';
      this.plainText = showText;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.player.firstChange) {
      return;
    }

    const previousPlayer: Player = changes.player.previousValue;
    const currentPlayer: Player = changes.player.currentValue;

    // If draw differently values that have changed.
    if (previousPlayer != null) {
      if (this.nActions > this.lastUpdatedValues.points && previousPlayer.points !== currentPlayer.points) {
        this.valueDifferences.points = currentPlayer.points -  previousPlayer.points;
        this.lastUpdatedValues.points = this.nActions;
      }

      const previousResources = previousPlayer.materialsDeck.getNMaterials();
      const currentResources = currentPlayer.materialsDeck.getNMaterials();
      if (this.nActions > this.lastUpdatedValues.resources && previousResources !== currentResources) {
        this.valueDifferences.resources = currentResources -  previousResources;
        this.lastUpdatedValues.resources = this.nActions;
      }

      const previousDevelopments = previousPlayer.developmentDeck.getNDevelopments();
      const currentDevelopments = currentPlayer.developmentDeck.getNDevelopments();
      if (this.nActions > this.lastUpdatedValues.developments && previousDevelopments !== currentDevelopments) {
        this.valueDifferences.developments = currentDevelopments -  previousDevelopments;
        this.lastUpdatedValues.developments = this.nActions;
      }


      if (this.nActions > this.lastUpdatedValues.knights && previousPlayer.nPlayedKnights !== currentPlayer.nPlayedKnights) {
        this.valueDifferences.knights = currentPlayer.nPlayedKnights -  previousPlayer.nPlayedKnights;
        this.lastUpdatedValues.knights = this.nActions;
      }
    }
  }

  getChangeString(valDiff: number, lastUpdatedAction: number): string {
    if (lastUpdatedAction === this.nActions || valDiff === 0) {
      return '';
    } else if (valDiff > 0) {
      return '(+' + valDiff + ')';
    } else {
      return '(-' + (-valDiff) + ')';
    }
}

}
