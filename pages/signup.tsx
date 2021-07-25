// import styles from "../styles/login.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "../utils/auth";
import { toast } from "tailwind-toast";
import { useEffect } from "react";

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

  const auth: any = useAuth();

  useEffect(() => {
    if (!!auth.uid) {
      router.push("/");
      return;
    }
  })

  const signup = ({ email, username, password }: SignupFields) => {
    auth
      .signup(email, username, password)
      .then(() => {
        toast()
          .success("Success!", "Your account has been created.")
          .with({ duration: 3000 })
          .show();
        router.push("/");
      })
      .catch((error) => {
        toast()
          .danger("An error occurred!", error.message)
          .with({ duration: 9000 })
          .show();
      });
  };

  return (
    <div>
      Signup!
      <form
        onSubmit={handleSubmit((data: SignupFields) => {
          signup(data);
        })}
      >
        <div>
          Email:{" "}
          <input
            aria-label="Email Address"
            name="email"
            type="email"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          />
          {errors.email && errors.email.message}
        </div>
        <div>
          Username:{" "}
          <input
            aria-label="Username"
            name="username"
            type="text"
            {...register("username", { required: true, maxLength: 64 })}
          />
          {errors.username && errors.username.message}
        </div>
        <div>
          Password:{" "}
          <input
            aria-label="Password"
            name="password"
            type="password"
            {...register("password", { required: true, minLength: 8 })}
          />
          {errors.password && errors.password.message}
        </div>
        <div>
          <button type="submit">Signup</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;