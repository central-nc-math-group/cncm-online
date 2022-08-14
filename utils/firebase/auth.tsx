import React, { useState, useEffect, useContext, createContext } from "react";
import queryString from "query-string";
import firebase from "firebase/app";
import "firebase/auth";
import { post } from "../restClient";
import { Auth } from "../types";

// USE THIS ONLY IN CLIENT-SIDE CONTEXT

const prod = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

if (!firebase.apps.length) {
  firebase.initializeApp(prod);
}

const authContext = createContext({});

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth(): Auth {
  const [user, setUser] = useState<firebase.User>(null);

  const login = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user);
        return "";
      })
      .catch((error) => {
        return understandLoginError(error.code);
      })
  };

  const signup = async (email, username, password) => {
    const result = await post<string>(`createUser`, { email, username, password });
    if (!result.success) return understandSignupError(result.value);
    return login(email, password);
  };

  const logout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
      });
  };

  const sendPasswordResetEmail = (email: string) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (password: string, code: string) => {
    const resetCode = code || getFromQueryString("oobCode");

    return firebase
      .auth()
      .confirmPasswordReset(resetCode as string, password)
      .then(() => {
        return true;
      });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    uid: user && user.uid,
    username: user && user.displayName,
    email: user && user.email,
    login,
    signup,
    logout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}

const getFromQueryString = (key) => {
  return queryString.parse(window.location.search)[key];
};

export const understandSignupError = (e) => {
  switch (e) {
    case "auth/email-already-exists":
      return "This email address is already in use. Please use an alternate address.";
    case "auth/invalid-user-token":
      return "It seems like your token has expired. Refresh the page and try again.";
    case "auth/network-request-failed":
      return "There was a network error. Refresh the page and try again.";
    case "auth/too-many-requests":
      return "There were too many requests from this device. Wait 5 minutes, refresh the page, and try again.";
    case "auth/user-token-expired":
      return "It seems that your token has expired. Refresh the page and try again.";
    case "auth/user-not-found":
      return "It seems that you do not have an account. Please sign up and try again.";
    case "auth/user-disabled":
      return "Your account has been disabled. Email us at `email` to resolve this.";
    case "auth/web-storage-unsupported":
      return "We use IndexedDB to store your credentials. If you have disabled this, please re-enable it so we can keep you logged in.";
    case "auth/no-empty-username":
      return "You can't sign up with an empty username. Please enter a username and try again.";
    case "auth/incorrect-username-syntax":
      return "Usernames can only contain alphanumeric characters and underscores. Make sure that your username only contains such characters";
    case "auth/username-already-exists":
      return "The username already exists. Please try to input a different username.";
    case "auth/invalid-email":
      return "The email is invalid. Please try again with a valid email.";
    case "auth/username-too-long":
      return "The username is too long. Please enter a username of at most 40 characters.";
    case "auth/email-too-long":
      return "The email is too long. Please enter a email of at most 60 characters.";
    case "auth/password-too-short":
      return "The password is too short. Please make sure that the password is at least 8 characters long";
    case "auth/incorrect-password-format":
      return "The password must contain at least one captial letter, one lowercase letter, one number, and one special character";
    case "auth/invalid-grade":
      return "The grade must be a positive integer";
    default:
      return "This looks like an error on our side. Please refresh the page and try again, or contact us with the issue!";
  }
};

export const understandLoginError = (e) => {
  const email = "";
  switch (e) {
    case "auth/invalid-email": // the only way to have an invalid email is if the username maps to null, i.e. no user found
      return "It seems that you do not have an account. Please sign up and try again.";
    case "auth/user-not-found":
      return "It seems that you do not have an account. Please sign up and try again.";
    case "auth/user-disabled":
      return `Your account has been disabled. Email us at ${email} to resolve this.`;
    case "auth/wrong-password":
      return "The password is incorrect. Please try to type the password correctly.";
    case "auth/too-many-requests":
      return "There were too many requests from this device. Wait 5 minutes, refresh the page, and try again.";
    default:
      return "This looks like an error on our side. Please refresh the page and try again, or contact us with the issue!";
  }
};
