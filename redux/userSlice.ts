import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//i18n

export interface DataUser {
  _id?: string;
  id?: string;
  name?: string;
  imageUrl?: string;
  email: string;
  status: string;
  access_token?: string;
  createdAt?: Date;
  language?: string;
  roles?: string[];
}

export const initialState: DataUser = {
  _id: "",
  id: "",
  name: "",
  imageUrl: "",
  email: "",
  status: "",
  access_token: "",
  language: "en",
  roles: [],
};

export interface RootState {
  user: DataUser;
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<DataUser>) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.imageUrl = action.payload.imageUrl;
      state.email = action.payload.email;
      state.status = action.payload.status;
      state.access_token = action.payload.access_token;
      state.roles = action.payload.roles;
    },
    logout: (state) => {
      state._id = "";
      state.name = "";
      state.imageUrl = "";
      state.email = "";
      state.status = "";
      state.access_token = "";
      state.roles = [];
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
