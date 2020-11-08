import {Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DixitComponent } from './dixit.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonComponentsModule} from '../services/common-components/common-components.module';
import {HttpClientModule} from '@angular/common/http';
import {StateService} from './services/state.service';
import {SelectionComponent} from './selection/selection.component';
import {GameTableComponent} from './selection/game-table/game-table.component';
import {ActiveGamesBoardComponent} from './selection/game-table/active-games-board/active-games-board.component';
import {NewGameDescriptionComponent} from './selection/new-game-description/new-game-description.component';
import {BoardComponent} from './board/board.component';
import {BoardDisplayComponent} from './board/board-display/board-display.component';
import {PlayersDisplayComponent} from './board/players-display/players-display.component';
import {PlayerDisplayComponent} from './board/players-display/player-display/player-display.component';
import {DeckComponent} from './board/board-display/deck/deck.component';
import {CardsListComponent} from './board/board-display/deck/cards-list/cards-list.component';
import {TableComponent} from './board/board-display/table/table.component';
import {CardComponent} from './board/board-display/table/card/card.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CardDialogComponent} from './board/board-display/deck/card-dialog/card-dialog.component';


const DECLARATIONS: any[] = [
  BoardComponent,
  BoardDisplayComponent,
  DeckComponent,
  CardDialogComponent,
  CardsListComponent,
  TableComponent,
  CardComponent,
  PlayersDisplayComponent,
  PlayerDisplayComponent,
  DixitComponent,
  SelectionComponent,
  GameTableComponent,
  ActiveGamesBoardComponent,
  NewGameDescriptionComponent
];

const MODULES: any[] = [
  CommonModule,
  NgbModule,
  CommonComponentsModule,
  ReactiveFormsModule,
];

@Injectable()
@NgModule({
  declarations: DECLARATIONS,
  exports: [
    DixitComponent
  ],
  imports: MODULES,
  providers: [ HttpClientModule, StateService ],
})
export class DixitModule { }
