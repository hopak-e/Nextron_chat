import { Timestamp } from "firebase/firestore";

export interface Lists {
  [x: string]: any;
}

export interface UserLists {
  displayName: string;
  uid: string;
}

export interface Message {
  text: string;
  uid: string;
  displayName: string;
  createdAt: Timestamp;
}

export interface SignUpInfo {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}
