import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"
import { Product } from "src/app/public/product.model";
import { AuthService } from "src/app/auth/auth.service";

@Injectable()

export class MainProductsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProducts(productCategory: string) {
    return this.http.get<Product[]>(`https://tech-shop-39eb9-default-rtdb.firebaseio.com/products/${productCategory}.json?`)
  }
}
