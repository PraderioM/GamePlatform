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

  @Input() cardDescription?: string;
  @Input() storyTellerName: string;
  @Input() isStoryTeller: boolean;
  @Input() playedCards: PlayedCard[];
  @Input() chosenCards: ChosenCard[];
  @Input() nPlayers: number;
  @Input() allChosen: boolean;
  @Input() deck: number[];
  @Input() cardPlayed: boolean;
  @Input() cardChosen: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
