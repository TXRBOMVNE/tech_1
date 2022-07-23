import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { User, UserAccount } from "../public/user.model";

export interface AuthResponse {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({ providedIn: "root" })

export class AuthService {

  user = new BehaviorSubject<User | null>(null)
  userAccountInfo = new BehaviorSubject<UserAccount | null>(null)
  private _tokenTimer: any

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  signUp(form: FormGroup) {
    return this.http.post<AuthResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA0zZNrxWHmmiCasmOGWHdtmSb73zSnQnI",
      {
        email: form.value.email,
        password: form.value.password,
        returnSecureToken: true
      }).pipe(tap(async (res) => {
        this.handleAuth(res.localId, res.email, res.idToken, +res.expiresIn)
        this.createUserData(form, res.localId)
      }))
  }

  login(form: FormGroup) {
    return this.http.post<AuthResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA0zZNrxWHmmiCasmOGWHdtmSb73zSnQnI",
      {
        email: form.value.email,
        password: form.value.password,
        returnSecureToken: true
      }).pipe(tap(res => {
        this.handleAuth(res.localId, res.email, res.idToken, +res.expiresIn)
        this.getUserData(res.localId).subscribe(res => this.userAccountInfo.next(res))
      }))
  }


  autoLogin() {
    if (!localStorage.getItem("login_info")) {
      return
    }
    let storageUser: {
      localId: string,
      email: string,
      _token: string,
      _tokenExpirationDate: Date
    } | undefined

    storageUser = JSON.parse(localStorage.getItem("login_info")!)

    if (!storageUser) {
      return
    }
    const loadedUser: User = new User(storageUser.localId, storageUser.email, storageUser._token, storageUser._tokenExpirationDate)
    this.user.next(loadedUser)
    this.getUserData(storageUser.localId).subscribe(res => this.userAccountInfo.next(res))
    this.autoLogout(new Date(storageUser._tokenExpirationDate).getTime() - new Date().getTime())
  }


  logout() {
    this.user.next(null)
    localStorage.removeItem("login_info")
    this.router.navigate(["/"])
    if (this._tokenTimer) {
      clearTimeout(this._tokenTimer)
    }
    this._tokenTimer = null
  }

  autoLogout(expiresIn: number) {
    if (expiresIn < 0) {
      expiresIn = 0
    }
    this._tokenTimer = setTimeout(() => {
      this.logout()
    }, expiresIn)
  }

  redirectUrl: string | null = null

  private handleAuth(localId: string, email: string, idToken: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    const user = new User(localId, email, idToken, expirationDate)
    this.user.next(user)
    localStorage.setItem("login_info", JSON.stringify(user))
    if (this.route.snapshot.queryParams["redirectUrl"]) {
      this.redirectUrl = this.route.snapshot.queryParams["redirectUrl"]
      this.router.navigateByUrl(this.redirectUrl!)
    } else {
      this.router.navigate(["/"])
    }
    this.autoLogout(expiresIn * 1000)
  }

  createUserData(form: FormGroup, localId: string) {
    this.http.put(`${environment.firebase.databaseURL}/users/${localId}.json`,
      {
        profile: {
          email: form.value.email,
          displayName: form.value.name,
          phoneNumber: form.value.number
        }
      },
    ).subscribe(() => this.getUserData(localId).subscribe(res => this.userAccountInfo.next(res)))
  }

  getUserData(uid: string) {
    return this.http.get<UserAccount>(`${environment.firebase.databaseURL}/users/${uid}.json`)

  }
}
