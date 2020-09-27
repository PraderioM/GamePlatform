import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DevelopmentDeck} from '../../services/models';
import {PlayKnight, PlayMonopoly, PlayResources, PlayRoads} from '../../services/plays/development';
import {assetsPath} from '../../services/constants';

@Component({
  selector: 'app-player-development-deck',
  templateUrl: './player-development-deck.component.html',
  styleUrls: ['./player-development-deck.component.css', '../../../services/common.styles.css']
})
export class PlayerDevelopmentDeckComponent implements OnInit {
  @Input() developmentDeck: DevelopmentDeck;

  @Output() playKnight = new EventEmitter<PlayKnight>();
  @Output() playMonopoly = new EventEmitter<PlayMonopoly>();
  @Output() playResources = new EventEmitter<PlayResources>();
  @Output() playRoads = new EventEmitter<PlayRoads>();

  developmentCardsPath = assetsPath.concat('/development_cards');
  knightImgPath = this.developmentCardsPath.concat('/knight.png');
  monopolyImgPath = this.developmentCardsPath.concat('/monopoly.png');
  resourcesImgPath = this.developmentCardsPath.concat('/resources.png');
  roadsImgPath = this.developmentCardsPath.concat('/roads.png');
  pointImgPath = this.developmentCardsPath.concat('/point.png');

  playingKnight = false;
  playingMonopoly = false;
  playingResources = false;
  playingRoads = false;

  constructor() { }

  ngOnInit(): void {
  }

  selectKnight() {
    this.resetIsPlayingCard();
    this.playingKnight = true;
  }

  selectMonopoly() {
    this.resetIsPlayingCard();
    this.playingMonopoly = true;
  }

  selectResources() {
    this.resetIsPlayingCard();
    this.playingResources = true;
  }

  selectRoads() {
    this.resetIsPlayingCard();
    this.playingRoads = true;
  }

  resetIsPlayingCard() {
    this.playingKnight = false;
    this.playingMonopoly = false;
    this.playingResources = false;
    this.playingRoads = false;
  }

}
