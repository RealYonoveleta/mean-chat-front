import { Timestamp } from 'firebase/firestore';

export interface Message {
  uid?: string;
  senderId: string;
  senderDisplayName: string;
  content: string;
  createdAt: Timestamp;
}
