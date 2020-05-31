import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SudokuComponent} from './sudoku.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import { BlockComponent } from './board/block/block.component';
import { CellComponent } from './board/block/cell/cell.component';
import { BoardComponent } from './board/board.component';
import { OptionsComponent } from './options/options.component';


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
    BoardComponent,
    OptionsComponent,
  ],
  exports: [
    SudokuComponent,
  ],
  imports: MODULES,
  providers: [ HttpClientModule ],
})
export class SudokuModule { }
