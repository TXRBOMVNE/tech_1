import { EventEmitter, Injectable, Output } from "@angular/core";
import { Product } from "../public/product.model";
import { ShoppingCart } from "../public/shopping-cart.model";

@Injectable({ providedIn: "root" })
export class ShoppingCartService {

  @Output() shoppingCartEmitter = new EventEmitter<ShoppingCart>()

  shoppingCart = new ShoppingCart([])

  constructor() { }

  addToCart(product: Product) {
    if (this.shoppingCart.products.indexOf(product) > -1) {
      this.shoppingCart.products[this.shoppingCart.products.indexOf(product)].amount++
    } else {
      this.shoppingCart.products.push(product)
    }
    this.shoppingCartEmitter.emit(this.shoppingCart)
    this.saveCart()
  }

  removeProduct(product: Product) {
    let productIndex = this.shoppingCart.products.indexOf(product)
    this.shoppingCart.products.splice(productIndex, 1)
    this.shoppingCartEmitter.emit(this.shoppingCart)
    this.saveCart()
  }

  removeOneFromCart(product: Product) {
    this.shoppingCart.products[this.shoppingCart.products.indexOf(product)].amount--
    this.saveCart()
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.shoppingCart))
  }

  retrieveCart() {
    if (!localStorage.getItem("cart")) {
      return
    }
    const loadedCart: ShoppingCart = JSON.parse(localStorage.getItem("cart")!)
    this.shoppingCart.products = loadedCart.products
    this.shoppingCartEmitter.emit(this.shoppingCart)
  }

}
