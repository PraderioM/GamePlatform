// Angular Modules
import { NgModule } from '@angular/core';

// App Modules
import { AppComponent } from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './registering/login/login.component';
import {RegisteringComponent} from './registering/registering.component';
import {RegisterComponent} from './registering/register/register.component';
import {HomeComponent} from './home/home.component';
import {TicTacToeModule} from './tic-tac-toe/tic-tac-toe.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

const MODULES: any[] = [
  NgbModule,
  BrowserModule,
  HttpClientModule,
  TicTacToeModule,
];


const DECLARATIONS: any[] = [
  AppComponent,
  HomeComponent,
  LoginComponent,
  RegisteringComponent,
  RegisterComponent,
];


@NgModule({
  imports: MODULES,
  declarations: DECLARATIONS,
  bootstrap: [ AppComponent ],
  providers: [ HttpClientModule ],
})
export class AppModule { }
