import { Timestamp } from 'firebase/firestore';

export interface Chat {
  title: string;
  participants: string[];
  lastMessage: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
}
