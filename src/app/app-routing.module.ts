import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AuthComponent } from "./auth/auth.component";
import { ShoppingCartComponent } from "./shopping-cart/shopping-cart.component";
import { UserComponent } from "./user/user.component";
import { AuthGuard } from "./auth/auth.guard";
import { CheckoutComponent } from "./shopping-cart/checkout/checkout.component";
import { ConfirmCartComponent } from "./shopping-cart/confirm-cart/confirm-cart.component";
import { ShoppingCartGuard } from "./shopping-cart/shopping-cart.guard";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "cart", component: ShoppingCartComponent, children: [
      { path: "", component: ConfirmCartComponent },
      { path: "checkout", component: CheckoutComponent, canActivate: [AuthGuard, ShoppingCartGuard] }
    ]
  },
  { path: "auth", component: AuthComponent },
  { path: "user", component: UserComponent, canActivate: [AuthGuard] }
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
