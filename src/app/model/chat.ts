import { User } from './user';

export interface Chat {
  _id?: string;
  name: string;
  isGroup: boolean;
  members: User[];
  lastMessage: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
