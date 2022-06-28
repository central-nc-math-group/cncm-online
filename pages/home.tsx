// import styles from "../styles/login.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "../utils/firebase/auth";
import { toast } from "tailwind-toast";
import { useEffect } from "react";
import { Auth } from "../utils/types";
import Navbar from "../components/Navbar/navbar"

interface HomePageProps {}

interface HomePageFields {
  email: string;
  username: string;
  password: string;
}

const HomePage: React.FC<HomePageProps> = () => {
  const router = useRouter();

  return (
    <div>
        <h1>Test</h1>
    </div>
  );
};

export default HomePage;
