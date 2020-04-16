import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { GameDescription } from '../services/models';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  @Output() enterGame = new EventEmitter<GameDescription>();
  @Output() backToGameSelection = new EventEmitter<void>();
  @Input() token: string;

  constructor() { }

  ngOnInit() {
  }

}
