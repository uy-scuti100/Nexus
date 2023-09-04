import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
   id: string | undefined;
   email?: string;
}

export interface AuthState {
   signedIn: boolean;
   signInFailed: boolean;
   user: User | null; // Use the User interface
}

const initialState: AuthState = {
   signedIn: false,
   signInFailed: false,
   user: null,
};

const isAuthenticated = createSlice({
   name: "auth",
   initialState,
   reducers: {
      signInWithEmailPasswordSuccess: (state, action: PayloadAction<User>) => {
         state.signedIn = true;
         state.user = action.payload;
      },
      signInWithEmailPasswordFailed: (state, action: PayloadAction<string>) => {
         state.signedIn = false;
         state.signInFailed = true;
         state.user = null;
      },

      signInWithGithubSuccess: (state, action: PayloadAction<User>) => {
         state.signedIn = true;
         state.user = action.payload;
      },
      signInWithGithubFailed: (state) => {
         state.signedIn = false;
         state.signInFailed = true;
         state.user = null;
      },
      signInWithGoogleSuccess: (state, action: PayloadAction<User>) => {
         state.signedIn = true;
         state.user = action.payload;
      },
      signInWithGoogleFailed: (state, action: PayloadAction<string>) => {
         state.signedIn = false;
         state.signInFailed = true;
         state.user = null;
      },
      signInWithTwitterSuccess: (state, action: PayloadAction<User>) => {
         state.signedIn = true;
         state.user = action.payload;
      },
      signInWithTwitterFailed: (state, action: PayloadAction<string>) => {
         state.signedIn = false;
         state.signInFailed = true;
         state.user = null;
      },
      logOut: (state) => {
         state.user = null;
      },
   },
});

export const {
   signInWithEmailPasswordSuccess,
   signInWithEmailPasswordFailed,
   signInWithGoogleSuccess,
   signInWithGoogleFailed,
   signInWithGithubFailed,
   signInWithGithubSuccess,
   signInWithTwitterFailed,
   signInWithTwitterSuccess,
   logOut,
} = isAuthenticated.actions;

export default isAuthenticated.reducer;
