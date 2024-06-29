import { Typography, Stack, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { WithFirebaseApiProps, withFirebaseApi } from "../Firebase";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";
import { asyncUpdateUserInfo } from "../redux/userSlice";

const EditProfileBase = (props: WithFirebaseApiProps) => {
    const userId = useAppSelector((state: RootState) => state.user.userId);
    const userInfo = useAppSelector(
      (state: RootState) => state.user.userInfo.value
    );
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState<string>("");
    const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  
    useEffect(() => {
      if (userInfo?.profilePicHandle == null) {
        return;
      }
  
      props.firebaseApi
        .asyncGetURLFromHandle(userInfo?.profilePicHandle)
        .then((url) => {
          setProfilePicUrl(url);
        });
    }, [userInfo?.profilePicHandle]);
  
    let profilePic = null;
    if (profilePicUrl) {
      profilePic = <img src={profilePicUrl} width={200} />;
    }
  
    return (
      <>
        <Typography variant="h2" component="div" align="left">
          Edit Profile
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
        <Stack direction="row" spacing={2}>
          <Typography
            variant="body1"
            align="left"
            sx={{ marginTop: "auto", marginBottom: "auto" }}
          >
            Profile Pic:
          </Typography>
        </Stack>
        <Button
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={async () => {
            dispatch(
              asyncUpdateUserInfo({
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

  export default withFirebaseApi(EditProfileBase);