import * as firebase from 'firebase';
import {FirebaseConfig} from './keys';  //'../config/Keys';

firebase.initializeApp(FirebaseConfig);
export const databaseRef = firebase.database().ref();
export const database = firebase.database();

export const todoRef = databaseRef.child("todos");
export const accountRef = databaseRef.child("account");
export const conversationRef = databaseRef.child("conversations");

