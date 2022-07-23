import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  animations: [
    trigger("enterFromSide", [
      transition(":enter", [
        style({ transform: "translateX(-100%)" }),
        animate("500ms ease-in-out", style({ transform: "translateX(0)" }))
      ]),
      transition(":leave", [
        style({ position: "absolute" }),
        animate("500ms ease-in-out", style({ transform: "translateX(100%)" }))
      ])
    ]),
    trigger("scaleDown", [
      transition(":enter", [
        style({ transform: "scaleY(0)", transformOrigin: "top" }),
        animate("150ms ease-in-out", style({ transform: "scaleY(100%)" }))
      ])
    ])
  ]
})
export class AuthComponent implements OnInit {

  signUpMode: boolean = false
  isLoading: boolean = false
  signUpError: string | null = null
  loginError: string | null = null
  needLogin: boolean | undefined

  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required)
  })

  signUpForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    name: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
    number: new FormControl(null, [Validators.required, Validators.pattern('[0-9+]*')])
  })

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  onLogin(form: FormGroup) {
    if (!form.valid) {
      return
    }
    this.isLoading = true
    this.authService.login(form)
      .subscribe({
        error: error => {
          this.translateError(error)
          this.isLoading = false
        },
        complete: () => {
          this.isLoading = false
        }
      })
  }

  onSignUp(form: FormGroup) {
    if (!form.valid) {
      return
    }
    this.isLoading = true
    this.authService.signUp(form)
      .subscribe({
        error: error => {
          this.translateError(error)
          this.isLoading = false
        },
        complete: () => {
          this.isLoading = false
        },
      })
  }

  translateError(error: any) {
    switch (error.error.error.message) {
      case "EMAIL_EXISTS":
        this.signUpError = "Email already registered"
        break;
      case "INVALID_PASSWORD":
        this.loginError = "Invalid credentials"
        break;
      case "EMAIL_NOT_FOUND":
        this.loginError = "Invalid credentials"
    }
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams["checkoutLogin"]) {
      this.needLogin = true
    }
  }

}
