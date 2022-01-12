export class Tokens {
  set refreshToken(value: string) {
    this._refreshToken = value;
  }
  get refreshToken(): string {
    return this._refreshToken as string;
  }
  jwt: string | undefined;
  private _refreshToken: string | undefined;
}
