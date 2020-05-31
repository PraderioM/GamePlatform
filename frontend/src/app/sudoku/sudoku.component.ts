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
  blockRows = 3;
  blockCols = 3;
  table: number[][] = this.getEmptyTable(this.blockRows * this.blockCols, this.blockRows * this.blockCols);

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
  }

  async createSuDoKu() {
    const fillResponse = await this.stateService.createSuDoKu(this.blockRows, this.blockCols);
    console.log(fillResponse);
    if (fillResponse.table != null) {
      this.table = fillResponse.table;
    } else {
      alert('An error occurred while attempting to create SuDoKu.');
    }
  }

  async solveSuDoKu() {
    const fillResponse = await this.stateService.solveSuDoKu(this.table, this.blockRows, this.blockCols);
    console.log(fillResponse);
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

  async hintSuDoKu() {
    // Get a list of all empty cell indexes.
    const emptyIndexes: number[][] = [];
    for (let row = 0; row < this.blockCols * this.blockRows; row++) {
      for (let col = 0; col < this.blockCols * this.blockRows; col++) {
        if (this.table[row][col] !== -1) {
          emptyIndexes.push([row, col]);
        }
      }
    }

    // If there are no empty cells we end it here.
    if (emptyIndexes.length === 0) {
      return;
    }

    // Solve sudoku.
    const fillResponse = await this.stateService.solveSuDoKu(this.table, this.blockRows, this.blockCols);
    console.log(fillResponse);
    // If there is no possible solution or there are multiple such solutions we show an alert.
    if (fillResponse.table === null) {
      if (fillResponse.fillStatus === -1) {
        alert('There exist multiple solutions for the proposed sudoku.');
      } else {
        alert('There is no possible solution for the proposed sudoku.');
      }
    // Otherwise we get a random value from the solution and place it in table.
    } else {
      // Chose a random value from the list of empty cells and update the table's value.
      const chosenCell = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      this.table[chosenCell[0]][chosenCell[1]] = fillResponse.table[chosenCell[0]][chosenCell[1]];
    }
  }

  updateTable(table: number[][]) {
    this.table = table;
  }

  clearTable() {
    this.table = this.getEmptyTable(this.blockRows * this.blockCols, this.blockRows * this.blockCols);
  }

  getEmptyTable(rows: number, cols: number) {
    const table: number[][] = [];
    let row: number[];
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      row = [];
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        row.push(-1);
      }
      table.push(row);
    }
    return table;
  }

  updateBlockShape(shape: number[]) {
    const rows = shape[0];
    const cols = shape[1];
    if (this.blockCols !== cols || this.blockRows !== rows) {
      this.blockCols = cols;
      this.blockRows = rows;
      this.clearTable();
    }
  }
}
