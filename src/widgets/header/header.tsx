import styles from "./header.module.css";
import Image from "next/image";
import logo from "@/assets/images/lc_logo.png";

const Header = () => {
  const navigationList = [{}];

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <h1 className={styles.title}>
          <Image src={logo} alt="Logo" width={70} />
          인챈트 시뮬레이터
        </h1>
        <button type="button" className={styles.sign_in}>
          로그인
        </button>
      </div>
      <nav className={styles.nav}>
        
      </nav>
    </header>
  );
};

export default Header;
