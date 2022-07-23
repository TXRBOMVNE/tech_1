import { Product } from "./product.model";

export class ShoppingCart {
  constructor(public products: Product[]) { }

  get totalPrice(): number {
    let totalPrice: number = 0
    if (this.products)
      this.products.forEach(product => totalPrice += (product.amount || 1) * (product.discountPrice || product.price))
    return totalPrice
  }
}
