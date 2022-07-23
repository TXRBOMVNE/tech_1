import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { User, UserAccount } from '../public/user.model';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  animations: [
    trigger("enterFromSide", [
      transition(":enter", [
        style({ transform: "translateX(-100%)", position: "absolute" }),
        animate("500ms ease-in-out", style({ transform: "translateX(0)" }))
      ]),
      transition(":leave", [
        style({ position: "absolute" }),
        animate("500ms ease-in-out", style({ transform: "translateX(-100%)" }))
      ])
    ]),
    trigger("enterFromSide1", [
      transition(":enter", [
        style({ transform: "translateX(100%)", position: "absolute" }),
        animate("500ms ease-in-out", style({ transform: "translateX(0)" }))
      ]),
      transition(":leave", [
        style({ position: "absolute" }),
        animate("500ms ease-in-out", style({ transform: "translateX(100%)", position: "absolute", }))
      ])
    ])
  ]
})

export class UserComponent implements OnInit, OnDestroy {


  showHistory: boolean = false
  currentUser: User | null = null
  userInfo: UserAccount | null = null
  editMode: boolean = false

  addressFormGroupArray: FormGroup[] = [
    new FormGroup({
      street: new FormControl(null, Validators.required),
      number: new FormControl(null, Validators.required),
      apNumber: new FormControl(null),
      city: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      zipCode: new FormControl(null, Validators.required),
    })
  ]

  accountForm = {
    profile: new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      number: new FormControl(null, [Validators.required, Validators.pattern('[0-9+]*')]),
      password: new FormControl("000000", [Validators.required, Validators.minLength(6)])
    }),
    addresses: this.addressFormGroupArray
  }

  sub: Subscription[] = []

  constructor(private authService: AuthService, private http: HttpClient) { }

  logout() {
    this.authService.logout()
  }

  updateUserData(form: { profile: FormGroup, addresses: FormGroup[] }) {
    console.log(this.currentUser)
    if (this.accountForm.profile.value !== this.userInfo?.profile && this.accountForm.profile.valid) {
      this.http.put(`${environment.firebase.databaseURL}/users/${this.currentUser?.localId}/profile.json`, {
        email: form.profile.value.email,
        name: form.profile.value.name,
        number: form.profile.value.number
      }).subscribe(() => console.log("put done"))
      this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${environment.firebase.apiKey}`,
        {
          idToken: this.currentUser?.idToken,
          email: form.profile.value.email,
          returnSecureToken: true
        }).subscribe(() => console.log("post done"))
    }
    let index = 0
    this.accountForm.addresses.forEach((address: FormGroup) => {
      if (address.valid) {
        this.http.put(`${environment.firebase.databaseURL}/users/${this.currentUser?.localId}/addresses/${index}.json`,
          {
            street: address.value.street,
            number: address.value.number,
            apNumber: address.value.apNumber,
            city: address.value.city,
            state: address.value.state,
            zipCode: address.value.zipCode
          }).subscribe(() => console.log("address done"))
      }
      index++
    })
    this.authService.getUserData(this.currentUser?.localId!).subscribe(res => this.userInfo = res)
  }

  addAddress() {
    if (this.accountForm.addresses.length !== 1) {
      this.accountForm.addresses.push(this.accountForm.addresses[this.accountForm.addresses.length - 1])
    }
    console.log(this.accountForm.addresses)
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("login_info")!)
    this.sub.push(this.authService.getUserData(this.currentUser?.localId!)
      .subscribe(res => {
        this.userInfo = res
        this.accountForm.profile.patchValue({
          email: res.profile.email,
          name: res.profile.name,
          number: res.profile.number
        })
      }))
    this.accountForm.profile.disable()
  }

  ngOnDestroy(): void {
    this.sub.forEach(sub => sub.unsubscribe())
  }

  enableEdit() {
    if (this.userInfo?.addresses) {
      for (let address of this.userInfo?.addresses) {
        this.addressFormGroupArray.push(
          new FormGroup({
            street: new FormControl(address.street, Validators.required),
            number: new FormControl(address.number, Validators.required),
            apNumber: new FormControl(address.apNumber),
            city: new FormControl(address.city, Validators.required),
            state: new FormControl(address.state, Validators.required),
            zipCode: new FormControl(address.zipCode, Validators.required),
          })
        )
      }
    }
    if (!this.editMode) {
      this.editMode = true
      this.accountForm.profile.enable()
    }
  }

  disableEdit() {
    if (this.editMode) {
      this.editMode = false
      this.accountForm.profile.disable()
    }
  }
}
