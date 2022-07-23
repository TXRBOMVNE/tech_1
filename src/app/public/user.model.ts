import { environment } from "src/environments/environment"
import { ShoppingCart } from "./shopping-cart.model"

export class User {
  constructor(
    public localId: string,
    public email: string,
    public idToken: string,
    private _tokenExpirationDate: Date
  ) { }

  get token() {
    if (!this.idToken || new Date() > this._tokenExpirationDate) {
      return null
    }
    return this.idToken
  }
}

export interface UserAccount {
  profile: {
    email: string,
    name: string,
    number: string
  },
  addresses?: [
    {
      street: string,
      number: string,
      apNumber?: string,
      city: string,
      state: string
      zipCode: string
    }
  ],
  shoppingHistory?: ShoppingCart[]
}
