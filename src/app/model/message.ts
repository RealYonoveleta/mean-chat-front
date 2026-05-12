import { User } from './user';
import { Location } from '../core/location/models/location';

export type MessageContentType = string | Location;

export enum MessageType {
  Text = 'text',
  Location = 'location',
}

export interface Message {
  _id?: string;
  chat: string;
  sender: User;
  content: MessageContentType;
  type: MessageType;
  createdAt: Date | string;
}
