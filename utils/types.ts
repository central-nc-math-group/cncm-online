import firebase from "firebase/app";
import "firebase/auth";

/*
 * The idea here is that if success is true, the value must be of type output.
 * Otherwise, it must be of type string for the error.
 */
interface ResponseBase<Success, Output> {
  success: Success;
  value: Success extends true ? Output : string;
}

export type Response<Output> =
  | ResponseBase<true, Output>
  | ResponseBase<false, Output>;

export interface Auth {
  uid: string;
  username: string;
  email: string;
  login: (email: string, password: string) => Promise<string>;
  signup: (
    email: string,
    username: string,
    password: string
  ) => Promise<string>;
  logout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
  confirmPasswordReset: (password: string, code: string) => Promise<boolean>;
}
