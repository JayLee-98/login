import React from "react";
import FirebaseApi from "./firebaseApi";
import { Subtract } from "utility-types";

const FirebaseContext = React.createContext<FirebaseApi | null>(null);

export interface WithFirebaseApiProps {
  firebaseApi: FirebaseApi;
}

export const withFirebaseApi = <P extends WithFirebaseApiProps>(
  Component: React.ComponentType<P>
) => {
  return (props: Subtract<P, WithFirebaseApiProps>) => (
    <FirebaseContext.Consumer>
      {(firebaseApi) => (
        <Component {...(props as P)} firebaseApi={firebaseApi!} />
      )}
    </FirebaseContext.Consumer>
  );
};

export default FirebaseContext;