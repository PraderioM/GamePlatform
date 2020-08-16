import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-options-display',
  templateUrl: './options-display.component.html',
  styleUrls: ['./options-display.component.css']
})
export class OptionsDisplayComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Input() gameId: string;
  showInstructions = false;
  instructions = 'I refuse to write the full instructions view this link https://www.eljuegodemesa.com/colonos-de-catan/';

  constructor() { }

  ngOnInit() {
  }

  toggleShowInstructions() {
    this.showInstructions = !this.showInstructions;
  }

  getInstructionsHeader() {
    if (this.showInstructions) {
      return 'Hide instructions';
    } else {
      return 'Show instructions';
    }
  }

}
