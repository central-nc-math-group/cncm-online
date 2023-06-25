// import styles from "../styles/login.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "../utils/firebase/auth";
import { useEffect } from "react";
import { Auth } from "../utils/types";
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar/navbar';

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
      toast.error(error, {
        duration: 4000,
        // Styling
        style: {
          backgroundColor: '#f2aaaa',
        },
        className: '',
        // Custom Icon
        // Change colors of success/error/loading icon
        // Aria
      });
    } else {
      toast.success('Success! Your account has been created', {
        duration: 4000,
        // Styling
        style: {
          backgroundColor: '#9ff092',
        },
        className: '',
        // Custom Icon
        // Change colors of success/error/loading icon
        // Aria
      });
      router.push("/");
    }
  };

  return (
    <>
    <Navbar num={-1}/>
  <section className="flex items-center justify-center w-screen h-full gradient-form md:h-screen md:w-screen">

    <div className="container py-12 px-6 h-full">
      <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
        <div className="xl:w-10/12 items-center justify-center border">
          <div className="bg-white shadow-lg rounded-lg">
            <div className="lg:flex lg:flex-wrap g-0">
              <div className="lg:w-6/12 px-4 md:px-0">
                <div className="md:p-12 md:mx-6">
                  <div className="text-center">
                  <div className="m-5 flex-shrink-0 flex items-center justify-center text-green-700 text-3xl">
                        <strong>CNCM</strong> Online
                    </div>
                  </div>
                  <form onSubmit={handleSubmit((data: SignupFields) => {
                    signup(data);
                  })}>
                    <p className="mb-4">Complete the following fields to create an account</p>
                    <div className={"mb-4"}>
                        <input
                          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                          aria-label="Username"
                          placeholder="Username"
                          name="username"
                          type="text"
                          {...register("username", {
                            required: {
                              value: true,
                              message: "Username is required"
                            },
                            maxLength: {
                              value: 40,
                              message: "Username length must not exceed 40 characters",
                            },
                            pattern: {
                              value: /^[a-zA-Z0-9]+$/,
                              message: "Username may only contain alphanumeric characters"
                            }
                          })}
                        />
                        <div className="text-red-500">{!!errors.username && errors.username.message}</div>
                    </div>
                    <div className="mb-4">
                      <input
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        aria-label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        {...register("email", {
                          required: {
                            value: true,
                            message: "Email is required",
                          },
                          pattern: /^\S+@\S+$/i,
                          maxLength: {
                            value: 60,
                            message: "Email length must not exceed 60 characters"
                          }
                        })}
                      />
                      <div className="text-red-500">{!!errors.email && errors.email.message}</div>
                    </div>
                    <div className="mb-4">
                      <input
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"

                        aria-label="Password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                          required: {
                            value:true,
                            message: "Password is required",
                          },
                          minLength: {
                            value:8,
                            message: "Password must be at least 8 characters long"
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*{}"'`/,._[\]~\-+])[a-zA-Z\d\w\W]{8,}$/,
                            message: "Password msut require at least one capital letter, one number, and one symbol"
                          }

                        })}
                      />
                    <div className="text-red-500">{!!errors.password && errors.password.message}</div>
                    </div>
                    <div className="text-center pt-1 mb-12 pb-1">
                      <button
                        className="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                        type="submit"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                        style={{
                          background: "linear-gradient(to right, #10e375, #2cbc58, #2f963f, #2b7329, #215116)"}}
                      >
                        Sign up
                      </button>
                    </div>
                    <div className="flex items-center justify-between pb-6">
                      <a href="/login" className="mb-0 mr-2">Already have an account?</a>
                    </div>
                  </form>
                </div>
              </div>
              <div
                className="lg:w-6/12 flex items-center lg:rounded-r-lg rounded-b-lg lg:rounded-bl-none"
                style={{
                  background: "linear-gradient(to right, #10e375, #2cbc58, #2f963f, #2b7329, #215116)"
                }}
              >
                <div className="text-white px-4 py-6 md:p-12 md:mx-6">
                  <h4 className="text-xl font-semibold mb-6">Welcome to CNCM Online!</h4>
                  <p className="text-sm">
                    Compete in the revolutionary CNCM Online scoring format where you get scored instantly and you gain more points the faster you solve problems! Join now to battle for the top spot in a test of speed and accuracy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  </>
  );
};

export default Signup;



//   return (
//     <div className={"mt-10 grid content-center justify-center"}>
//       <h1
//         className={
//           "mb-6 text-3xl grid content-center justify-center w-full max-w-sm text-blue-500"
//         }
//       >
//         Sign up!
//       </h1>
//       <form
//         className={"w-full max-w-sm"}
//         onSubmit={handleSubmit((data: SignupFields) => {
//           signup(data);
//         })}
//       >
//         <div className={"md:flex md:items-center mb-6"}>
//           <div className={"md:w-1/3"}>
//             <label
//               className={
//                 "block text-gray-500 font-bold md:text-left md-1 md:mb-0 pr-4"
//               }
//               htmlFor="username"
//             >
//               Username
//             </label>
//           </div>

//           <div className={"md:w-2/3"}>
//             <input
//               className={
//                 "bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
//               }
//               aria-label="Username"
//               name="username"
//               type="text"
//               {...register("username", {
//                 required: true,
//                 maxLength: 40,
//                 pattern: /^[a-zA-Z0-9]+$/,
//               })}
//             />
//             {!!errors.username && errors.username.message}
//           </div>
//         </div>

//         <div className={"md:flex md:items-center mb-6"}>
//           <div className={"md:w-1/3"}>
//             <label
//               className={
//                 "block text-gray-500 font-bold md:text-left md-1 md:mb-0 pr-4"
//               }
//               htmlFor="email"
//             >
//               Email
//             </label>
//           </div>

//           <div className={"md:w-2/3"}>
//             <input
//               className={
//                 "bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
//               }
//               aria-label="Email Address"
//               name="email"
//               type="email"
//               {...register("email", {
//                 required: true,
//                 pattern: /^\S+@\S+$/i,
//                 maxLength: 60,
//               })}
//             />
//             {!!errors.email && errors.email.message}
//           </div>
//         </div>

//         <div className={"md:flex md:items-center mb-6"}>
//           <div className={"md:w-1/3"}>
//             <label
//               className={
//                 "block text-gray-500 font-bold md:text-left md-1 md:mb-0 pr-4"
//               }
//               htmlFor="password"
//             >
//               Password
//             </label>
//           </div>

//           <div className={"md:w-2/3"}>
//             <input
//               className={
//                 "bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
//               }
//               aria-label="Password"
//               name="password"
//               type="password"
//               {...register("password", {
//                 required: true,
//                 minLength: 8,
//                 pattern:
//                   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*{}"'`/,._[\]~\-+])[a-zA-Z\d\w\W]{8,}$/,
//               })}
//             />
//             {!!errors.password && errors.password.message}
//           </div>
//         </div>

//         <div className={"md:flex md:items-center"}>
//           <div className={"md:w-1/3"}></div>
//           <div className={"md:w-2/3"}>
//             <button
//               className={
//                 "shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
//               }
//               type="submit"
//             >
//               Sign up!
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Signup;
