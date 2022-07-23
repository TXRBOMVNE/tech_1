import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ShoppingCart } from 'src/app/public/shopping-cart.model';
import { ShoppingCartService } from '../shopping-cart.service';

declare var paypal: any

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  animations: [
    trigger("enterFromTop", [
      transition(":enter", [
        style({ transform: "translateY(-100%)" }),
        animate("300ms ease-in-out", style({ transform: "translateY(0)" }))
      ]),
      transition(":leave",
        animate("300ms ease-in-out", style({ transform: "translateY(-100%)" }))
      )
    ])
  ]
})
export class CheckoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("paypal", { static: false }) paypalElement: ElementRef | undefined

  constructor(private shoppingCartService: ShoppingCartService) { }

  shoppingCart = new ShoppingCart([])
  paymentSuccess: boolean | undefined
  paymentFail: boolean = false
  isLoading: boolean = false

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.shoppingCart
  }

  ngAfterViewInit(): void {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        this.isLoading = true
        return actions.order.create({
          "purchase_units": [
            {
              "amount": {
                "currency_code": "USD",
                "value": this.shoppingCart.totalPrice + (this.shoppingCart.totalPrice * .01)
              }
            }
          ]
        })
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((order: any) => {
          this.paymentSuccess = true
          this.isLoading = false
        })
      },
      onError: (error: any) => {
        this.paymentFail = true
        this.isLoading = false
      }
    }).render(this.paypalElement?.nativeElement)
  }

  ngOnDestroy(): void {
    if (this.paymentSuccess) {
      this.shoppingCartService.shoppingCart.products = []
      this.shoppingCartService.saveCart()
    }
  }

}
