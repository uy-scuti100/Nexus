import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
   id: number;
   email?: string; // Email is optional as it's not used for GitHub/Google login
   password?: string; // Password is optional and not used for GitHub/Google login
   githubId?: string; // GitHub user ID
   googleId?: string; // Google user ID
}

export interface AuthState {
   loggedIn: boolean;
   loggingIn: boolean;
   loginSuccess: boolean;
   loginFailed: boolean;
   user: User | null; // Use the User interface
}

const initialState: AuthState = {
   loggedIn: false,
   loggingIn: false,
   loginSuccess: false,
   loginFailed: false,
   user: null,
};

const isAuthenticated = createSlice({
   name: "auth",
   initialState,
   reducers: {
      loginWithEmailPassword: (state) => {
         state.loggingIn = true;
         state.loginSuccess = false;
         state.loginFailed = false;
         state.loggedIn = false;
         state.user = null;
      },
      loginWithEmailPasswordSuccess: (state, action: PayloadAction<User>) => {
         state.loggedIn = true;
         state.loggingIn = false;
         state.loginSuccess = true;
         state.loginFailed = false;
         state.user = action.payload;
      },
      loginWithEmailPasswordFailed: (state) => {
         state.loggedIn = false;
         state.loggingIn = false;
         state.loginSuccess = false;
         state.loginFailed = true;
         state.user = null;
      },
      logOut: (state) => {
         state.loggedIn = false;
         state.loggingIn = false;
         state.loginSuccess = false;
         state.loginFailed = false;
         state.user = null;
      },
      loginWithGithub: (state) => {
         state.loggingIn = true;
         state.loginSuccess = false;
         state.loginFailed = false;
         state.loggedIn = false;
         state.user = null;
      },
      loginWithGithubSuccess: (state, action: PayloadAction<User>) => {
         state.loggedIn = true;
         state.loggingIn = false;
         state.loginSuccess = true;
         state.loginFailed = false;
         state.user = action.payload;
      },
      loginWithGithubFailed: (state) => {
         state.loggedIn = false;
         state.loggingIn = false;
         state.loginSuccess = false;
         state.loginFailed = true;
         state.user = null;
      },
      loginWithGoogle: (state) => {
         state.loggingIn = true;
         state.loginSuccess = false;
         state.loginFailed = false;
         state.loggedIn = false;
         state.user = null;
      },
      loginWithGoogleSuccess: (state, action: PayloadAction<User>) => {
         state.loggedIn = true;
         state.loggingIn = false;
         state.loginSuccess = true;
         state.loginFailed = false;
         state.user = action.payload;
      },
      loginWithGoogleFailed: (state) => {
         state.loggedIn = false;
         state.loggingIn = false;
         state.loginSuccess = false;
         state.loginFailed = true;
         state.user = null;
      },
   },
});

export const {
   loginWithEmailPassword,
   loginWithGoogleFailed,
   loginWithGoogleSuccess,
   logOut,
   loginWithGoogle,
   loginWithGithubSuccess,
   loginWithGithub,
   loginWithEmailPasswordFailed,
   loginWithEmailPasswordSuccess,
   loginWithGithubFailed,
} = isAuthenticated.actions;

export default isAuthenticated.reducer;
