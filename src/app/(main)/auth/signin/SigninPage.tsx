"use client";
import LoginForm from "@/features/auth/ui/LoginForm";
import styles from "./SigninPage.module.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SigninClient = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("signup") === "success") {
      alert("회원가입이 완료되었습니다.");
    }
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <h3>로그인</h3>
        <LoginForm />
        <div className={styles.signup_tools}>
          <p>계정이 없으신가요?</p>
          <Link href={"./signup"}>회원가입</Link>
        </div>
        <div className={styles.notice}>
          <p>현재 회원가입을 이용하실 수 없습니다.</p>
        </div>
      </main>
    </div>
  );
};

export default SigninClient;
