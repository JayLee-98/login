import { firebaseConfig } from "./firebaseConfig";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";

export default class FirebaseApi {
  app: FirebaseApp;
  analytics: Analytics;
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
  }
}
