import { User } from './user';

export interface Message {
  _id?: string;
  chat: string;
  sender: User;
  content: string;
  createdAt: Date | string;
}
