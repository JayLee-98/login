import { useEffect } from "react";
import Header from "./components/Header";
import { WithFirebaseApiProps, withFirebaseApi } from "./Firebase";
import { useAppDispatch } from "./redux/hooks";
import { setUserId } from "./redux/userSlice";

const App = (props: WithFirebaseApiProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return props.firebaseApi.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUserId(user.uid));
      } else {
        dispatch(setUserId(null));
      }
    });
  }, []);

  return (
    <>
      <Header />
    </>
  );
};

export default withFirebaseApi(App);
