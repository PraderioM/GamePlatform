import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';


export class LoginResponse {
  public token?: string;
  public name?: string;
  public errorMessage: string;
  public incorrectName = false;
  public incorrectPassword = false;
}

class RegisteringResponse {
  public token?: string;
  public errorMessage: string;
  public incorrectName = false;
  public incorrectPassword = false;
  public incorrectPasswordConfirm = false;
}


@Injectable()
export class StateService {
    // urlPath = 'http://localhost:2121';
    // urlPath = 'http://0.0.0.0:2121';
    // urlPath = 'http://192.168.1.19:2121';
    // urlPath = 'http://85.53.252.2:27182';
    urlPath = 'http://gameplatform.tetesake.site:27182';
    token?: string;

    constructor(private http: HttpClient) {
    }

    async login(name: string, password: string) {
      console.log('Logging in as ' + name);
      const response = await this.http
        .get<LoginResponse>(this.urlPath + '/login',
          {params: new HttpParams().set('name', name).set('password', password)})
        .toPromise();

      response.name = name;

      this.setToken(response.token);
      return response;
    }

    async logout() {
      console.log('Logging out');
      await this.http
        .get(this.urlPath + '/logout',
          {params: new HttpParams().set('token', this.getToken())}
          )
        .toPromise();

      this.setToken(null);

      console.log('Successfully logged out');
    }

    async register(name: string, password: string, confirmedPassword: string) {
      console.log('Registering');
      const response = await this.http
        .get<RegisteringResponse>(this.urlPath + '/register',
          {params: new HttpParams().set('name', name).set('password', password).set('confirmed_password', confirmedPassword)})
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
