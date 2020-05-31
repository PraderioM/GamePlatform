import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Output() update = new EventEmitter<number[][]>();
  @Input() table: number[][];
  @Input() blockRows: number;
  @Input() blockCols: number;

  constructor() { }

  ngOnInit(): void {
  }

  getBlockRowIndexes() {
    const indexes: number[] = [];
    for (let i = 0; i < this.blockCols; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  getBlockColIndexes() {
    const indexes: number[] = [];
    for (let i = 0; i < this.blockRows; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  getTableBlock(rowIndex: number, colIndex: number) {
    const outSlice: number[][] = [];
    let rowSlice: number[];

    for (let row = 0; row < this.blockRows; row++) {
      rowSlice = [];
      for (let col = 0; col < this.blockCols; col++) {
        rowSlice.push(this.table[this.blockRows * rowIndex + row][this.blockCols * colIndex + col]);
      }
      outSlice.push(rowSlice);
    }
    return outSlice;
  }

  updateTable(block: number[][], rowIndex: number, colIndex: number) {
    for (let row = 0; row < this.blockRows; row++) {
      for (let col = 0; col < this.blockCols; col++) {
        this.table[this.blockRows * rowIndex + row][this.blockCols * colIndex + col] = block[row][col];
      }
    }
    this.update.emit(this.table);
  }

}
