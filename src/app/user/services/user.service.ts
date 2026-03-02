import { inject, Injectable } from '@angular/core';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { FirestoreService } from '../../core/firebase/services/firestore.service';
import { User } from '../../model/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestoreService = inject(FirestoreService);
  private firestore = this.firestoreService.firestore;

  private collection: string = 'users';

  private user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();

  private userDoc(uid: string) {
    return doc(this.firestore, this.collection, uid);
  }

  async createUser(uid: string, user: User) {
    const userRef = this.userDoc(uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, user);
    }
  }

  getUser(uid: string) {
    const userPromise = getDoc(this.userDoc(uid)).then((user) => {
      return { uid, ...user.data() } as User;
    });
    return from(userPromise);
  }

  getAllUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, this.collection);

    const usersPromise = getDocs(usersRef).then((snapshot) =>
      snapshot.docs.map(
        (doc) =>
          ({
            uid: doc.id,
            ...doc.data(),
          }) as User,
      ),
    );

    return from(usersPromise);
  }
}
