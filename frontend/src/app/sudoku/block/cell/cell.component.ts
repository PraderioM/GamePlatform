import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  @Output() update = new EventEmitter<number>();
  @Input() value: number;

  constructor() { }

  ngOnInit(): void {
  }

  updateValue(val: string) {
    this.value = this.valueFromString(val);
    this.update.emit(this.value);
  }

  valueFromString(val: string) {
    if (val === '') {
      return -1;
    } else {
      const newVal = parseInt(val, 10);
      // Only return value if it is an integer between  1 and 9 included.
      if (isNaN(newVal) || newVal < 1 || newVal > 9) {
        return this.value;
      } else {
        return newVal;
      }
    }
  }

  getStringValue() {
    return this.value === -1 ? '' : this.value;
  }

}
