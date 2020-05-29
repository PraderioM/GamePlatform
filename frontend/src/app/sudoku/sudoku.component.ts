import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css'],
  providers: [HttpClient],
})
export class SudokuComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  table: number[][] = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1]
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getTableSlice(rowIndex: number, colIndex: number) {
    const outSlice: number[][] = [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1]
    ];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        outSlice[row][col] = this.table[3 * rowIndex + row][3 * colIndex + col];
      }
    }
    return outSlice;
  }

  updateTable(block: number[][], rowIndex: number, colIndex: number) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        this.table[3 * rowIndex + row][3 * colIndex + col] = block[row][col];
      }
    }
  }

  checkSuDoKu() {
    // todo implement.
  }

}
