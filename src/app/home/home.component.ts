import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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
  ]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
