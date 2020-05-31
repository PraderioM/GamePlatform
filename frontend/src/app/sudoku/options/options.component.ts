import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  @Output() clearTable = new EventEmitter<void>();
  @Output() hintSuDoKu = new EventEmitter<void>();
  @Output() solveSuDoKu = new EventEmitter<void>();
  @Output() createSuDoKu = new EventEmitter<void>();
  @Output() backToMenu = new EventEmitter<void>();
  @Output() update = new EventEmitter<number[]>();

  @Input() blockCols: number;
  @Input() blockRows: number;

  constructor() { }

  ngOnInit(): void {
  }


  updateBlockCols(val: string) {
    this.blockCols = this.preProcessBlockDim(val, this.blockCols + 1);
    this.update.emit([this.blockRows, this.blockCols]);
  }

  updateBlockRows(val: string) {
    this.blockRows = this.preProcessBlockDim(val, this.blockRows + 1);
    this.update.emit([this.blockRows, this.blockCols]);
  }

  preProcessBlockDim(val: string, defaultVal: number) {
    const newVal = parseInt(val, 10);

    // If number is not an integer or is lower than 1 we return default value.
    if (isNaN(newVal) || newVal < 1) {
      return defaultVal;
    } else {
      return newVal;
    }
  }

}
