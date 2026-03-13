import { Injectable } from '@angular/core';

interface LocalUser {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly testUser: LocalUser = {
    username: 'admin',
    password: '1234',
  };

  private _isAuthenticated = false;

  /**
   * Call to try logging in the hard‑coded test user.
   * Returns true when credentials match, false otherwise.
   */
  login(username: string, password: string): boolean {
    if (
      username === this.testUser.username &&
      password === this.testUser.password
    ) {
      this._isAuthenticated = true;
      return true;
    }
    this._isAuthenticated = false;
    return false;
  }

  logout(): void {
    this._isAuthenticated = false;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
}
