import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/public/product.model';
import { ShoppingCart } from 'src/app/public/shopping-cart.model';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-confirm-cart',
  templateUrl: './confirm-cart.component.html',
  styleUrls: ['./confirm-cart.component.css']
})
export class ConfirmCartComponent implements OnInit {

  constructor(private shoppingCartService: ShoppingCartService) { }

  shoppingCart = new ShoppingCart([])

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.shoppingCart
  }

  removeProductFromCart(product: Product) {
    this.shoppingCartService.removeProduct(product)
  }

  addOne(product: Product) {
    this.shoppingCartService.addToCart(product)
  }

  removeOne(product: Product) {
    this.shoppingCartService.removeOneFromCart(product)
  }

}
