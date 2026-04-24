import styles from "./SignupForm.module.css";
import { signupAction } from "../model/actions";

const SignupForm = () => {
  return (
    <form className={styles.signup_form} action={signupAction}>
      <input
        className={`${styles.input} ${styles.email}`}
        name="email"
        type="email"
        placeholder="이메일"
        required
      />
      <input
        className={`${styles.input} ${styles.password}`}
        name="password"
        type="password"
        placeholder="비밀번호"
        required
      />
      <input
        className={`${styles.input} ${styles.name}`}
        name="name"
        type="text"
        placeholder="이름"
        required
      />
      <button className={styles.submit} type="submit">
        회원가입
      </button>
    </form>
  );
};

export default SignupForm;
