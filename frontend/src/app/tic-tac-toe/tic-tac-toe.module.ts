import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TicTacToeComponent} from './tic-tac-toe.component';
import {SelectionComponent} from './selection/selection.component';
import {BoardComponent} from './board/board.component';
import { GameTableComponent } from './selection/game-table/game-table.component';
import { ActiveGamesBoardComponent } from './selection/game-table/active-games-board/active-games-board.component';
import { NewGameDescriptionComponent } from './selection/new-game-description/new-game-description.component';
import { PlayersDisplayComponent } from './board/players-display/players-display.component';
import { BoardDisplayComponent } from './board/board-display/board-display.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PlayerDisplayComponent} from './board/players-display/player-display/player-display.component';
import { CellDisplayComponent } from './board/board-display/cell-display/cell-display.component';
// tslint:disable-next-line:max-line-length
import {HttpClientModule} from '@angular/common/http';
import { StateService } from './services/state.service';
import {CommonComponentsModule} from '../services/common-components/common-components.module';


const DECLARATIONS: any[] = [
  TicTacToeComponent,
  SelectionComponent,
  BoardComponent,
  GameTableComponent,
  ActiveGamesBoardComponent,
  NewGameDescriptionComponent,
  PlayersDisplayComponent,
  PlayerDisplayComponent,
  BoardDisplayComponent,
  CellDisplayComponent,
];

const MODULES: any[] = [
  CommonModule,
  NgbModule,
  CommonComponentsModule,
];

@Injectable()
@NgModule({
  declarations: DECLARATIONS
  ,
  exports: [
    TicTacToeComponent,
  ],
  imports: MODULES,
  providers: [ HttpClientModule, StateService ],
})
export class TicTacToeModule { }
