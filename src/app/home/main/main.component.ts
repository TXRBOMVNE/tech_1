import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/public/product.model';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import { MainProductsService } from './main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [MainProductsService]
})
export class MainComponent implements OnInit, OnDestroy {
  subs: Subscription[] = []

  featuredProducts: Product[] = []
  popularProducts: Product[] = []
  newProducts: Product[] = []

  isAddingToCart: boolean = false
  isLoading: boolean = false

  constructor(private mainProductsService: MainProductsService, private shoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.isLoading = true
    this.subs.push(this.mainProductsService.getProducts("new").subscribe({
      next: productsArrayResponse => this.newProducts = productsArrayResponse,
      error: () => console.log("Couldn't retrieve products"),
      complete: () => this.isLoading = false
    }))
    this.subs.push(this.mainProductsService.getProducts("popular").subscribe({
      next: productsArrayResponse => this.popularProducts = productsArrayResponse,
      error: () => console.log("Couldn't retrieve products"),
      complete: () => this.isLoading = false
    }))
    this.subs.push(this.mainProductsService.getProducts("featured").subscribe({
      next: productsArrayResponse => this.featuredProducts = productsArrayResponse,
      error: () => console.log("Couldn't retrieve products"),
      complete: () => this.isLoading = false
    }))
  }

  addToCart(product: Product) {
    this.shoppingCartService.addToCart(product)
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }
}
