"use client";
import styles from "./LoginForm.module.css";
import { loginAction } from "../model/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    setErrorMessage("");
    const result = await loginAction(formData);

    if (result.success) {
      router.refresh();
      return;
    }

    setErrorMessage(result.error ?? "로그인에 실패했습니다.");
  };

  return (
    <form className={styles.signin_form} action={handleSubmit}>
      <input
        className={`${styles.input} ${styles.email}`}
        name="email"
        type="email"
        placeholder="이메일"
      />
      <input
        className={`${styles.input} ${styles.password}`}
        name="password"
        type="password"
        placeholder="비밀번호"
      />
      <button className={styles.submit} type="submit">
        로그인
      </button>
      {errorMessage && <p>{errorMessage}</p>}
    </form>
  );
};

export default LoginForm;
