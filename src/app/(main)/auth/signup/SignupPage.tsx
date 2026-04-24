"use client";
import SignupForm from "@/features/auth/ui/SignupForm";
import styles from "./page.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const SignupPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("signup") !== "adminjungie") {
      router.replace("/auth/signin");
    }
  }, [searchParams, router]);

  return (
      <div className={styles.container}>
        <main className={styles.content}>
          <h3>회원가입</h3>
          <SignupForm />
        </main>
      </div>
  );
};

export default SignupPage;
