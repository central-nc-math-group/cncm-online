// import styles from "../styles/login.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "../utils/auth";
import { toast } from "tailwind-toast";
import { useEffect } from "react";

interface SigninProps {}

interface SigninFields {
  email: string;
  password: string;
}

const Signup: React.FC<SigninProps> = () => {
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
  });

  const signin = ({ email, password }: SigninFields) => {
    auth
      .signin(email, password)
      .then(() => {
        toast()
          .success("Success!", "You have signed in.")
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
      Signin!
      <form
        onSubmit={handleSubmit((data: SigninFields) => {
          signin(data);
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
