import { inject, Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../../../user/services/user.service';
import { FirebaseService } from '../../firebase/services/firebase.service';
import { FIREBASE_AUTH_ERROR_MAP } from '../auth-error.map';
import { User } from '../../../model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseService = inject(FirebaseService);
  private userService = inject(UserService);
  private auth = this.firebaseService.auth;

  private user = new BehaviorSubject<FirebaseUser | null | undefined>(undefined);
  user$ = this.user.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, async (user) => {
      await user?.reload();
      this.user.next(user);
    });
  }

  private customError(firebaseErrorCode: string) {
    const errorMessage =
      FIREBASE_AUTH_ERROR_MAP[firebaseErrorCode] || 'An unexpected error has occurred';

    return new Error(errorMessage);
  }

  async signUp(user: User, password: string) {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, user.email, password);
      const firebaseUser = credential.user;

      await updateProfile(firebaseUser, {
        displayName: `${user.name} ${user.surname}`,
      });

      await this.userService.createUser(firebaseUser.uid, user);
    } catch (err: any) {
      throw this.customError(err.code);
    }
  }

  async signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (err: any) {
      throw this.customError(err.code);
    }
  }

  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
      const user = result.user;
      const [name, surname] = user.displayName?.split(' ')!;
      await this.userService.createUser(user.uid, {
        email: user.email!,
        name,
        surname,
      });
    } catch (err: any) {
      throw this.customError(err.code);
    }
  }

  async signOut() {
    await signOut(this.auth);
  }
}
