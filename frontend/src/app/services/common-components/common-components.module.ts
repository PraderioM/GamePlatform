import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GameResolutionDisplayComponent} from './game-resolution-display/game-resolution-display.component';
import {OptionsDisplayComponent} from './options-display/options-display.component';
import { GameOptionsComponent } from './game-options/game-options.component';
import { ExistingGameSearchComponent } from './existing-game-search/existing-game-search.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LeaderboardRowDisplayComponent } from './leaderboard/leaderboard-row-display/leaderboard-row-display.component';



@NgModule({
  declarations: [
    GameResolutionDisplayComponent,
    OptionsDisplayComponent,
    GameOptionsComponent,
    ExistingGameSearchComponent,
    LeaderboardComponent,
    LeaderboardRowDisplayComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GameResolutionDisplayComponent,
    OptionsDisplayComponent,
    GameOptionsComponent,
    ExistingGameSearchComponent,
    LeaderboardComponent,
  ]

})
export class CommonComponentsModule { }
