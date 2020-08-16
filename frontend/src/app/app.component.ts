import { Component } from '@angular/core';
import {LoginResponse, StateService} from './services/state.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [StateService, HttpClient]
})
export class AppComponent {
  // token?: string;
  // name?: string;
  // loggedIn = false;
  // Todo change back, just for testing.
  token = 'b838f148-8228-4fc2-97ed-802d7fd9c142';
  name = 'PraderioM';
  loggedIn = true;

  logIn(loginResponse: LoginResponse) {
    this.token = loginResponse.token;
    this.name = loginResponse.name;
    this.loggedIn = true;
  }

  logOut() {
    this.loggedIn = false;
  }
}
