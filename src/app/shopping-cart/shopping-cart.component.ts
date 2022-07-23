import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from '../public/shopping-cart.model';
import { ShoppingCartService } from './shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  sub: any

  shoppingCart = new ShoppingCart([])
  constructor(private shoppingCartService: ShoppingCartService) { }


  ngOnInit() {
    this.shoppingCart = this.shoppingCartService.shoppingCart
  }
}
