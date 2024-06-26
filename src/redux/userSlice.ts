import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userId: string | null | undefined;
}

const initialState: UserState = {
  userId: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setUserId } = userSlice.actions;

export default userSlice.reducer;
