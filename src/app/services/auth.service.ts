import {Injectable} from '@angular/core';
import {FirebaseAuth} from '@angular/fire';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: firebase.User;

  constructor(private FAuth: AngularFireAuth) {
  }

  login(data: any) {
    return this.FAuth.auth.signInWithEmailAndPassword(data.email, data.password);
  }

  register(data: any) {
    return this.FAuth.auth.createUserWithEmailAndPassword(data.email, data.password);
  }
}
