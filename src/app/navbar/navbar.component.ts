import { animate, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../public/product.model';
import { ShoppingCart } from '../public/shopping-cart.model';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger("enterFromTop", [
      transition(":enter", [
        style({ transform: "translateY(-150%)" }),
        animate("300ms ease-in-out", style({ transform: "translateY(0)" }))
      ]),
      transition(":leave",
        animate("300ms ease-in-out", style({ transform: "translateY(-150%)" }))
      )
    ]),
    trigger("appear", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("300ms ease-in-out", style({ opacity: 1 }))
      ]),
      transition(":leave", [
        animate("300ms ease-in-out", style({ opacity: 0 }))]
      )
    ]),
    trigger("enterFromSide", [
      transition(":enter", [
        style({ transform: "translateX(-120%)" }),
        animate("300ms ease-in-out", style({ transform: "translateX(0)" }))
      ]),
      transition(":leave", [
        animate("300ms ease-in-out", style({ transform: "translateX(100%)", opacity: 0 }))
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  sub: any

  showShoppingCart: boolean = false
  shoppingCart = new ShoppingCart([])
  activeUrl: boolean = false

  constructor(private shoppingCartService: ShoppingCartService, private router: Router, location: Location) {
    router.events.subscribe(() => {
      if (location.path().startsWith("/cart")) {
        this.activeUrl = true
      } else {
        this.activeUrl = false
      }
    })
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

  ngOnInit() {
    this.shoppingCartService.shoppingCart = this.shoppingCart
    this.sub = this.shoppingCartService.shoppingCartEmitter
      .subscribe(cart => this.shoppingCart = cart)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
