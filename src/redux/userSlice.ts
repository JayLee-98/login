import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FirebaseApi } from "../Firebase";
import { UserInfo, WithLoadingState } from "../types";
import {AppThunk} from './store';

export interface UserState {
  userId: string | null | undefined;
  userInfo: {
    value: UserInfo | null | undefined,
  } & WithLoadingState;
}

const initialState: UserState = {
  userId: undefined,
  userInfo: {
    value: undefined,
    loadState: 'idle'
  },
};

export const asyncGetUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async (action: {firebaseApi: FirebaseApi, userId: string}) => {
    return await action.firebaseApi.asyncGetUserInfo(action.userId);
  }
);

export const asyncSetUserInfo = createAsyncThunk(
  'user/setUserInfo',
  async (action: {firebaseApi: FirebaseApi, userId: string, userInfo: UserInfo}) => {
    return await action.firebaseApi.asyncSetUserInfo(action.userId, action.userInfo);
  }
);

export const asyncUpdateUserInfo = createAsyncThunk(
  'user/updateUserInfo',
  async (action: {firebaseApi: FirebaseApi, userId: string, userInfo: Partial<UserInfo>}) => {
    return await action.firebaseApi.asyncUpdateUserInfo(action.userId, action.userInfo);
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<{
      value: UserInfo | null | undefined,
    } & WithLoadingState>) => {
      state.userInfo.value = action.payload.value;
      state.userInfo.loadState = action.payload.loadState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetUserInfo.pending, (state) => {
        state.userInfo.value = undefined;
        state.userInfo.loadState = 'loading';
      })
      .addCase(asyncGetUserInfo.fulfilled, (state, action) => {
        state.userInfo.value = action.payload;
        state.userInfo.loadState = 'idle';
      })
      .addCase(asyncGetUserInfo.rejected, (state, action) => {
        state.userInfo.value = undefined;
        state.userInfo.loadState = 'failed';
      })
      .addCase(asyncSetUserInfo.pending, (state) => {
        state.userInfo.value = undefined;
        state.userInfo.loadState = 'loading';
      })
      .addCase(asyncSetUserInfo.fulfilled, (state, action) => {
        state.userInfo.value = action.payload;
        state.userInfo.loadState = 'idle';
      })
      .addCase(asyncSetUserInfo.rejected, (state) => {
        state.userInfo.value = undefined;
        state.userInfo.loadState = 'failed';
      })
      .addCase(asyncUpdateUserInfo.pending, (state) => {
        state.userInfo.value = undefined;
        state.userInfo.loadState = 'loading';
      })
      .addCase(asyncUpdateUserInfo.fulfilled, (state, action) => {
        state.userInfo.value = action.payload;
        state.userInfo.loadState = 'idle';
      })
      .addCase(asyncUpdateUserInfo.rejected, (state) => {
        state.userInfo.value = undefined;
        state.userInfo.loadState = 'failed';
      });
  },
});

export const { setUserId, setUserInfo } = userSlice.actions;

export const handleUserChange =
  (firebaseApi: FirebaseApi, userId: string | null): AppThunk =>
    (dispatch, getState) => {
      if (userId === getState().user.userId) {
        return;
      }
      dispatch(setUserId(userId));
      dispatch(setUserInfo({
        value: undefined,
        loadState: 'idle',
      }))
      if (userId === null || userId === undefined) {
        return;
      }
      dispatch(asyncGetUserInfo({ firebaseApi, userId }));
    };
    
export default userSlice.reducer;
