import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DescribeCard} from '../../services/plays/describe.card';
import {PlayCard} from '../../services/plays/play.card';
import {ChooseCard} from '../../services/plays/choose.card';
import {PlayedCard, ChosenCard} from '../../services/models';

@Component({
  selector: 'app-board-display',
  templateUrl: './board-display.component.html',
  styleUrls: ['./board-display.component.css']
})
export class BoardDisplayComponent implements OnInit {
  @Output() describeCard = new EventEmitter<DescribeCard>();
  @Output() playCard = new EventEmitter<PlayCard>();
  @Output() chooseCard = new EventEmitter<ChooseCard>();
  @Output() endTurn = new EventEmitter<void>();

  @Input() cardDescription?: string;
  @Input() gameStarted: boolean;
  @Input() storyTellerName: string;
  @Input() name: string;
  @Input() isStoryTeller: boolean;
  @Input() playedCards: PlayedCard[];
  @Input() chosenCards: ChosenCard[];
  @Input() nPlayers: number;
  @Input() allChosen: boolean;
  @Input() allPlayed: boolean;
  @Input() deck: number[];
  @Input() cardPlayed: boolean;
  @Input() imageSet: string;
  @Input() cardChosen: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
