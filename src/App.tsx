import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import Header from "./components/Header";
import { WithFirebaseApiProps, withFirebaseApi } from "./Firebase";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { RootState } from "./redux/store";
import { setUserId } from "./redux/userSlice";

const isLoadingState = (state: RootState): boolean => {
  return state.user.userId === undefined;
};

const App = (props: WithFirebaseApiProps) => {
  const isLoading = useAppSelector(isLoadingState);
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

  if (isLoading) {
    return <CircularProgress sx={{ margin: "auto" }} />;
  }

  return (
    <>
      <Header />
    </>
  );
};

export default withFirebaseApi(App);