import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ShoppingCartService } from './shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor(private authService: AuthService, private shoppingCartService: ShoppingCartService) { }


  ngOnInit(): void {
    this.authService.autoLogin()
  }

  ngAfterViewInit(): void {
    this.shoppingCartService.retrieveCart()
  }
}
