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

  updateValue(val: any) {
    console.log(val);
    this.value = this.valueFromString(val);
    this.update.emit(this.value);
  }

  valueFromString(val: string) {
    if (val === '') {
      return -1;
    } else {
      const newVal = parseInt(val, 10);
      if (isNaN(newVal)) {
        return -1;
      } else {
        return newVal;
      }
    }
  }

  getStringValue() {
    return this.value === -1 ? '' : this.value;
  }

}
