import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TicTacToeComponent} from './tic-tac-toe.component';
import {SelectionComponent} from './selection/selection.component';
import {BoardComponent} from './board/board.component';
import { GameOptionsComponent } from './selection/game-options/game-options.component';
import { GameTableComponent } from './selection/game-table/game-table.component';
import { LeaderboardComponent } from './selection/game-table/leaderboard/leaderboard.component';
import { ActiveGamesBoardComponent } from './selection/game-table/active-games-board/active-games-board.component';
import { NewGameDescriptionComponent } from './selection/game-options/new-game-description/new-game-description.component';
import { ExistingGameSearchComponent } from './selection/game-options/existing-game-search/existing-game-search.component';
import { PlayersDisplayComponent } from './board/players-display/players-display.component';
import { BoardDisplayComponent } from './board/board-display/board-display.component';
import { OptionsDisplayComponent } from './board/options-display/options-display.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PlayerDisplayComponent} from './board/players-display/player-display/player-display.component';
import {RowDisplayComponent} from './board/board-display/row-display/row-display.component';
import { CellDisplayComponent } from './board/board-display/row-display/cell-display/cell-display.component';
import { ActiveGameDisplayComponent } from './selection/game-table/active-games-board/active-game-display/active-game-display.component';
import { LeaderBoardPositionDisplayComponent } from './selection/game-table/leaderboard/leader-board-position-display/leader-board-position-display.component';
import { GameResolutionDisplayComponent } from './board/game-resolution-display/game-resolution-display.component';


const DECLARATIONS: any[] = [
  TicTacToeComponent,
  SelectionComponent,
  BoardComponent,
  GameOptionsComponent,
  GameTableComponent,
  LeaderboardComponent,
  ActiveGamesBoardComponent,
  NewGameDescriptionComponent,
  ExistingGameSearchComponent,
  PlayersDisplayComponent,
  PlayerDisplayComponent,
  BoardDisplayComponent,
  OptionsDisplayComponent,
];

const MODULES: any[] = [
  CommonModule,
  NgbModule,
];

@NgModule({
  declarations: [
    DECLARATIONS,
    RowDisplayComponent,
    CellDisplayComponent,
    ActiveGameDisplayComponent,
    LeaderBoardPositionDisplayComponent,
    GameResolutionDisplayComponent
  ],
  exports: [
    TicTacToeComponent,
    SelectionComponent,
    BoardComponent,
  ],
  imports: MODULES,
})
export class TicTacToeModule { }
