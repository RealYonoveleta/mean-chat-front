import { Timestamp } from 'firebase/firestore';

export interface Message {
  uid?: string;
  senderId: string;
  content: string;
  createdAt: Timestamp;
}
