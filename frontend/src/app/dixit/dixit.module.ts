import {Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DixitComponent } from './dixit.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonComponentsModule} from '../services/common-components/common-components.module';
import {HttpClientModule} from '@angular/common/http';
import {StateService} from '../services/state.service';
import {SelectionComponent} from './selection/selection.component';
import {GameTableComponent} from './selection/game-table/game-table.component';
import {ActiveGamesBoardComponent} from './selection/game-table/active-games-board/active-games-board.component';
import {NewGameDescriptionComponent} from './selection/new-game-description/new-game-description.component';
import {BoardComponent} from './board/board.component';
import {BoardDisplayComponent} from './board/board-display/board-display.component';
import {PlayersDisplayComponent} from './board/players-display/players-display.component';
import {PlayerDisplayComponent} from './board/players-display/player-display/player-display.component';
import {DeckComponent} from './board/board-display/deck/deck.component';
import {TableComponent} from './board/board-display/table/table.component';
import {CardComponent} from './board/board-display/table/card/card.component';
import {CardsListComponent} from './board/board-display/deck/cards-list/cards-list.component';


const DECLARATIONS: any[] = [
  DixitComponent,
  SelectionComponent,
  GameTableComponent,
  ActiveGamesBoardComponent,
  NewGameDescriptionComponent,
  BoardComponent,
  BoardDisplayComponent,
  DeckComponent,
  CardsListComponent,
  TableComponent,
  CardComponent,
  PlayersDisplayComponent,
  PlayerDisplayComponent
];

const MODULES: any[] = [
  CommonModule,
  NgbModule,
  CommonComponentsModule,
];

@Injectable()
@NgModule({
  declarations: DECLARATIONS,
  imports: MODULES,
  exports: [DixitComponent],
  providers: [ HttpClientModule, StateService ],
})
export class DixitModule { }
