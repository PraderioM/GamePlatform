import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SudokuComponent} from './sudoku.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import { BlockComponent } from './block/block.component';
import { CellComponent } from './block/cell/cell.component';


const DECLARATIONS: any[] = [
  SudokuComponent,
];

const MODULES: any[] = [
  CommonModule,
  NgbModule,
];

@Injectable()
@NgModule({
  declarations: [
    DECLARATIONS,
    BlockComponent,
    CellComponent,
  ],
  exports: [
    SudokuComponent,
  ],
  imports: MODULES,
  providers: [ HttpClientModule ],
})
export class SudokuModule { }
