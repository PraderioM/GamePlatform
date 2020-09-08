import {Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RockPaperScissorsComponent } from './rock-paper-scissors.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {StateService} from '../services/state.service';
import {SelectionComponent} from './selection/selection.component';
import {BoardComponent} from './board/board.component';
import {ExistingGameSearchComponent} from './selection/existing-game-search/existing-game-search.component';
import {GameOptionsComponent} from './selection/game-options/game-options.component';
import {GameTableComponent} from './selection/game-table/game-table.component';
import {ActiveGamesBoardComponent} from './selection/game-table/active-games-board/active-games-board.component';
import {LeaderboardComponent} from './selection/game-table/leaderboard/leaderboard.component';
// tslint:disable-next-line:max-line-length
import {LeaderboardRowDisplayComponent} from './selection/game-table/leaderboard/leaderboard-row-display/leaderboard-row-display.component';
import {NewGameDescriptionComponent} from './selection/new-game-description/new-game-description.component';
import {ReactiveFormsModule} from '@angular/forms';
import {PlayerDisplayComponent} from './board/players-display/player-display/player-display.component';
import {BoardDisplayComponent} from './board/board-display/board-display.component';
import {PlayersDisplayComponent} from './board/players-display/players-display.component';
import {CommonComponentsModule} from '../services/common-components/common-components.module';


const DECLARATIONS = [
  RockPaperScissorsComponent,
  SelectionComponent,
  ExistingGameSearchComponent,
  GameOptionsComponent,
  GameTableComponent,
  ActiveGamesBoardComponent,
  LeaderboardComponent,
  LeaderboardRowDisplayComponent,
  NewGameDescriptionComponent,
  BoardComponent,
  BoardDisplayComponent,
  PlayersDisplayComponent,
  PlayerDisplayComponent,
];


const MODULES = [
  CommonModule,
  NgbModule,
  CommonComponentsModule,
];

@Injectable()
@NgModule({
  declarations: DECLARATIONS,
  exports: [
    RockPaperScissorsComponent,
  ],
  imports: [
    MODULES,
    ReactiveFormsModule
  ],
  providers: [ HttpClientModule, StateService ],
})
export class RockPaperScissorsModule { }
