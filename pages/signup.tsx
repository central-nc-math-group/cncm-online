// import styles from "../styles/login.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "../utils/firebase/auth";
import { toast } from "tailwind-toast";
import { useEffect } from "react";
import { Auth } from "../utils/types";

interface SignupProps {}

interface SignupFields {
  email: string;
  username: string;
  password: string;
}

const Signup: React.FC<SignupProps> = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const auth: Auth = useAuth() as Auth;

  useEffect(() => {
    if (!!auth.uid) {
      router.push("/");
      return;
    }
  })

  const signup = async ({ email, username, password }: SignupFields) => {
    const error = await auth.signup(email, username, password);
    if (!!error) {
      toast()
        .danger("An error occurred!", error)
        .with({ duration: 9000 })
        .show();
    } else {
      toast()
        .success("Success!", "Your account has been created.")
        .with({ duration: 3000 })
        .show();
      router.push("/");
    }
  };

  return (
    <div className={"mt-10 grid content-center justify-center"}>
      <h1
        className={
          "mb-6 text-3xl grid content-center justify-center w-full max-w-sm text-blue-500"
        }
      >
        Sign up!
      </h1>
      <form
        className={"w-full max-w-sm"}
        onSubmit={handleSubmit((data: SignupFields) => {
          signup(data);
        })}
      >
        <div className={"md:flex md:items-center mb-6"}>
          <div className={"md:w-1/3"}>
            <label
              className={
                "block text-gray-500 font-bold md:text-left md-1 md:mb-0 pr-4"
              }
              htmlFor="username"
            >
              Username
            </label>
          </div>

          <div className={"md:w-2/3"}>
            <input
              className={
                "bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              }
              aria-label="Username"
              name="username"
              type="text"
              {...register("username", {
                required: true,
                maxLength: 40,
                pattern: /^[a-zA-Z0-9]+$/,
              })}
            />
            {!!errors.username && errors.username.message}
          </div>
        </div>

        <div className={"md:flex md:items-center mb-6"}>
          <div className={"md:w-1/3"}>
            <label
              className={
                "block text-gray-500 font-bold md:text-left md-1 md:mb-0 pr-4"
              }
              htmlFor="email"
            >
              Email
            </label>
          </div>

          <div className={"md:w-2/3"}>
            <input
              className={
                "bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              }
              aria-label="Email Address"
              name="email"
              type="email"
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
                maxLength: 60,
              })}
            />
            {!!errors.email && errors.email.message}
          </div>
        </div>

        <div className={"md:flex md:items-center mb-6"}>
          <div className={"md:w-1/3"}>
            <label
              className={
                "block text-gray-500 font-bold md:text-left md-1 md:mb-0 pr-4"
              }
              htmlFor="password"
            >
              Password
            </label>
          </div>

          <div className={"md:w-2/3"}>
            <input
              className={
                "bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              }
              aria-label="Password"
              name="password"
              type="password"
              {...register("password", {
                required: true,
                minLength: 8,
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*{}"'`/,._[\]~\-+])[a-zA-Z\d\w\W]{8,}$/,
              })}
            />
            {!!errors.password && errors.password.message}
          </div>
        </div>

        <div className={"md:flex md:items-center"}>
          <div className={"md:w-1/3"}></div>
          <div className={"md:w-2/3"}>
            <button
              className={
                "shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              }
              type="submit"
            >
              Sign up!
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
