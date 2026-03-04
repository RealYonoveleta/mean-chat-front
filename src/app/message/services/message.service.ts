import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from 'firebase/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { ChatService } from '../../chat/services/chat.service';
import { FirebaseService } from '../../core/firebase/services/firebase.service';
import { Message } from '../../model/message';
import { CurrentUserService } from '../../core/user/current-user.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private firestoreService = inject(FirebaseService);
  private chatService = inject(ChatService);
  private currentUserService = inject(CurrentUserService);

  private firestore = this.firestoreService.firestore;

  private collectionName: string = 'messages';

  private oldestDocPerChat = new Map<string, QueryDocumentSnapshot<any>>();

  private getCollection(chatId: string) {
    return collection(this.firestore, `chats/${chatId}/${this.collectionName}`);
  }

  async createMessage(chatId: string, message: Message) {
    const messageCollection = this.getCollection(chatId);
    await addDoc(messageCollection, message);

    const user = await firstValueFrom(this.currentUserService.currentUser$);
    const displayName = user.uid === message.senderId ? 'You' : message.senderDisplayName;

    await this.chatService.updateChat(chatId, {
      lastMessage: `${displayName}: ${message.content}`,
    });
  }

  getLatestMessages(chatId: string, limitCount: number = 30) {
    const messageCollection = this.getCollection(chatId);
    const queryRef = query(messageCollection, orderBy('createdAt', 'desc'), limit(limitCount));

    return new Observable<Message[]>((observer) => {
      const unsubscribe = onSnapshot(
        queryRef,
        (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
          snapshot.docs.forEach((doc) => this.oldestDocPerChat.set(chatId, doc));
          observer.next(messages.reverse() as Message[]);
        },
        (error) => observer.error(error),
      );

      return unsubscribe;
    });
  }

  async getOlderMessages(chatId: string, limitCount: number = 20) {
    const lastVisible = this.oldestDocPerChat.get(chatId);
    if (!lastVisible) return [];

    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const queryRef = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      startAfter(lastVisible),
      limit(limitCount),
    );

    const snapshot = await getDocs(queryRef);

    snapshot.docs.forEach((doc) => this.oldestDocPerChat.set(chatId, doc));

    const messages = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));

    return messages.reverse() as Message[];
  }
}
