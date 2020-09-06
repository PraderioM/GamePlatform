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
  // Todo write correct instructions.
  instructions = 'Call Sergi Sanchez (0034 650 38 79 93) he\'ll explain everything or die trying.\nHe\'ll be damned for the rest of eternity muajajajajajajaja';

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
