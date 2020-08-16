import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../../services/models';
import {BasePlay} from '../../services/plays/base.play';

@Component({
  selector: 'app-board-display',
  templateUrl: './board-display.component.html',
  styleUrls: ['./board-display.component.css']
})
export class BoardDisplayComponent implements OnInit {
  @Output() makePlay = new EventEmitter<BasePlay>();
  @Input() description: GameDescription;
  @Input() token: string;
  @Input() name: string;

  constructor() { }

  ngOnInit() {
  }

  // todo implement all possible plays to make.
}
