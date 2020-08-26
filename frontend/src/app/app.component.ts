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
  token?: string;
  name?: string;
  loggedIn = false;
  // token = 'fe7166da-f0c8-4080-80d3-ef9a472334fd';
  // name = 'PraderioM';
  // loggedIn = true;

  logIn(loginResponse: LoginResponse) {
    this.token = loginResponse.token;
    this.name = loginResponse.name;
    this.loggedIn = true;
  }

  logOut() {
    this.loggedIn = false;
  }
}
