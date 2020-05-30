import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StateService} from './services/state.service';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css'],
  providers: [StateService, HttpClient],
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

  constructor(private stateService: StateService) { }

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

  async solveSuDoKu() {
    const fillResponse = await this.stateService.solveSuDoKu(this.table);
    if (fillResponse.table != null) {
      this.table = fillResponse.table;
    } else {
      if (fillResponse.fillStatus === -1) {
        alert('There exist multiple solutions for the proposed sudoku.');
      } else {
        alert('There is no possible solution for the proposed sudoku.');
      }
    }
  }

}
