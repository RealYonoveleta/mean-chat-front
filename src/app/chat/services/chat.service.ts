import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirestoreService } from '../../core/firebase/services/firestore.service';
import { Chat } from '../../model/chat';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private firestoreService = inject(FirestoreService);
  private notificationService = inject(NotificationService);

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

  getChats(uid: string): Observable<Chat[]> {
    const queryRef = query(
      collection(this.firestore, this.collection),
      where('participants', 'array-contains', uid),
      orderBy('updatedAt', 'desc'),
    );

    return new Observable<Chat[]>((observer) => {
      const unsubscribe = onSnapshot(
        queryRef,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
          observer.next(data as Chat[]);
        },
        (error) => observer.error(error),
      );

      return unsubscribe;
    });
  }

  async createChat(chat: Chat) {
    const chatCollection = collection(this.firestore, this.collection);
    await addDoc(chatCollection, chat);
    this.notificationService.showToast(`Chat ${chat.title} created successfully`);
  }

  getChat(uid: string) {
    return getDoc(this.chatDoc(uid));
  }
}
