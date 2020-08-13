import {Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CatanComponent} from './catan.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {StateService} from '../services/state.service';



const DECLARATIONS: any[] = [
  CatanComponent
];

const MODULES: any[] = [
  CommonModule,
  NgbModule,
];

@Injectable()
@NgModule({
  declarations: [
    DECLARATIONS,
  ],
  exports: [
    CatanComponent,
  ],
  imports: MODULES,
  providers: [ HttpClientModule, StateService ],
})
export class CatanModule { }
