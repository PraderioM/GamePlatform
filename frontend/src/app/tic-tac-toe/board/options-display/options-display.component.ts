import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-options-display',
  templateUrl: './options-display.component.html',
  styleUrls: ['./options-display.component.css']
})
export class OptionsDisplayComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Input() gameId: string;

  constructor() { }

  ngOnInit() {
  }

}
