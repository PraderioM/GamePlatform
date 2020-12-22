import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {backendURL} from './constants';


export class LoginResponse {
  public token?: string;
  public name?: string;
  public errorMessage: string;
  public incorrectName = false;
}

class RegisteringResponse {
  public token?: string;
  public errorMessage: string;
  public incorrectName = false;
  public incorrectNameConfirm = false;
}


@Injectable()
export class StateService {
    token?: string;

    constructor(private http: HttpClient) {
    }

    async login(name: string) {
      console.log('Logging in as ' + name);
      const response = await this.http
        .get<LoginResponse>(backendURL + '/login',
          {params: new HttpParams().set('name', name)})
        .toPromise();

      response.name = name;

      this.setToken(response.token);
      return response;
    }

    async logout() {
      console.log('Logging out');
      await this.http
        .get(backendURL + '/logout',
          {params: new HttpParams().set('token', this.getToken())}
          )
        .toPromise();

      this.setToken(null);

      console.log('Successfully logged out');
    }

    async register(name: string, confirmedName: string) {
      console.log('Registering');
      const response = await this.http
        .get<RegisteringResponse>(backendURL + '/register',
          {params: new HttpParams().set('name', name).set('confirmed_name', confirmedName)})
        .toPromise();
      console.log(response);

      this.setToken(response.token);
      return response;
    }

    getToken() {
      return this.token;
    }

    setToken(token?: string) {
      this.token = token;
    }
}
