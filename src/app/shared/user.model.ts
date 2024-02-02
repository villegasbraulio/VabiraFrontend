export class UserModel {
    constructor(
      public username: string,
      public id: string,
      // private _token: string,
      // private _tokenExpirationDate: Date
    ) {}
  
    // get token() {
    //   if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
    //     return null;
    //   }
    //   return this._token;
    // }
  
    // get tokenExpirationDate() {
    //   return this._tokenExpirationDate;
    // }
  }
  