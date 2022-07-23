import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoadingSpinnerComponent } from "../public/css-animations/loading-spinner.component";
import { CarouselComponent } from "./carousel/carousel.component";
import { FooterComponent } from "./footer/footer.component";
import { HomeComponent } from "./home.component";
import { MainComponent } from "./main/main.component";

@NgModule({
  declarations: [
    HomeComponent,
    FooterComponent,
    CarouselComponent,
    MainComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HomeComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ]
})

export class HomeModule { }
