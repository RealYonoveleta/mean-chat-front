import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Chat } from '../../model/chat';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { FirestoreService } from '../../core/firebase/services/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private firestoreService = inject(FirestoreService);
  private firestore = this.firestoreService.firestore;

  private collection: string = 'chats';

  private chat = new BehaviorSubject<Chat | null>(null);
  chat$ = this.chat.asObservable();

  private chatDoc(uid: string) {
    return doc(this.firestore, this.collection, uid);
  }

  setActiveChat(chat: Chat) {
    this.chat.next(chat);
  }

  getChats(uid: string) {
    const queryRef = query(
      collection(this.firestore, this.collection),
      where('participants', 'array-contains', uid),
      orderBy('updatedAt', 'desc'),
    );

    return new Observable<any[]>((observer) => {
      const unsubscribe = onSnapshot(
        queryRef,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
          observer.next(data);
        },
        (error) => observer.error(error),
      );

      return unsubscribe;
    });
  }

  async createChat(chat: Chat) {
    const chatCollection = collection(this.firestore, this.collection);
    await addDoc(chatCollection, chat);
  }

  getChat(uid: string) {
    return getDoc(this.chatDoc(uid));
  }
}
