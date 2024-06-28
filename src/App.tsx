import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import { WithFirebaseApiProps, withFirebaseApi } from "./Firebase";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { RootState } from "./redux/store";
import {
  asyncSetUserInfo,
  asyncUpdateUserInfo,
  handleUserChange,
} from "./redux/userSlice";

const isLoadingState = (state: RootState): boolean => {
  return state.user.userId === undefined;
};

const OnboardingBase = (props: WithFirebaseApiProps) => {
  const userId = useAppSelector((state: RootState) => state.user.userId);
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string>("");
  return (
    <>
      <Typography variant="h2" component="div" align="left">
        Finish setting up your account.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Typography
          variant="body1"
          align="left"
          sx={{ marginTop: "auto", marginBottom: "auto" }}
        >
          username:
        </Typography>
        <TextField
          value={username}
          label="Edit Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </Stack>
      <Button
        variant="contained"
        sx={{ marginTop: 2 }}
        onClick={async () => {
          dispatch(
            asyncSetUserInfo({
              firebaseApi: props.firebaseApi,
              userId: userId!,
              userInfo: { username: username },
            })
          );
        }}
      >
        SUBMIT
      </Button>
    </>
  );
};

const Onboarding = withFirebaseApi(OnboardingBase);

const EditProfileBase = (props: WithFirebaseApiProps) => {
  const userId = useAppSelector((state: RootState) => state.user.userId);
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string>("");
  return (
    <>
      <Typography variant="h2" component="div" align="left">
        Edit Profile
      </Typography>
      <Stack direction="row" spacing={2}>
        <Typography variant="body1" align="left" sx={{marginTop: "auto", marginBottom: "auto"}}>
          username: 
        </Typography>
        <TextField
          value={username}
          label="Edit Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </Stack>
      <Button
        variant="contained"
        sx={{marginTop:2}}
        onClick={async () => {
          dispatch(asyncUpdateUserInfo({
            firebaseApi: props.firebaseApi,
            userId: userId!,
            userInfo: {username: username},
          }))
        }}
      >
        SUBMIT
      </Button>
    </>
  );
};

const EditProfile = withFirebaseApi(EditProfileBase);

const Body = () => {
  const userId = useAppSelector((state: RootState) => state.user.userId);
  const userInfo = useAppSelector(
    (state: RootState) => state.user.userInfo.value
  );
  const userInfoLoadState = useAppSelector(
    (state: RootState) => state.user.userInfo.loadState
  );
  if (userId === null) {
    return (
      <>
        <Typography>Please Log In</Typography>
      </>
    );
  }

  if (userInfoLoadState === "loading") {
    return <CircularProgress />;
  }

  if (userInfoLoadState === "failed" || userInfo === undefined) {
    return (
      <>
        <Typography>Something went wrong.</Typography>
      </>
    );
  }

  if (userInfo === null) {
    return <Onboarding />;
  }

  return (
    <>
      <Typography>{`Welcome ${userInfo.username}!`}</Typography>
      <EditProfile />
    </>
  );
};

const App = (props: WithFirebaseApiProps) => {
  const isLoading = useAppSelector(isLoadingState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return props.firebaseApi.onAuthStateChanged((user) => {
      if (user) {
        dispatch(handleUserChange(props.firebaseApi, user.uid));
      } else {
        dispatch(handleUserChange(props.firebaseApi, null));
      }
    });
  }, []);

  if (isLoading) {
    return <CircularProgress sx={{ margin: "auto" }} />;
  }

  return (
    <>
      <Header />
      <Container sx={{ paddingTop: 3 }}>
        <Box sx={{ margin: "auto" }}>
          <Body />
        </Box>
      </Container>
    </>
  );
};

export default withFirebaseApi(App);
