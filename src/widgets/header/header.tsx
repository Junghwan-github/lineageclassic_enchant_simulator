import styles from "./header.module.css";
import Image from "next/image";
import logo from "@/assets/images/lc_logo.png";
import Link from "next/link";
import { CiMenuFries } from "react-icons/ci";

const Header = () => {
  const navigationList = [
    // notice
    { item: "공지", link: "coming-soon" },
    // feedback
    { item: "개선제안", link: "coming-soon" },
    // about
    { item: "개발자소개", link: "coming-soon" },
    // contact
    { item: "제작문의", link: "coming-soon" },
    // collaboration
    { item: "협업제안", link: "coming-soon" },
    // ads
    { item: "광고/제휴", link: "coming-soon" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <h1 className={styles.title}>
          <Link href={"/"}>
            <Image src={logo} alt="Logo" width={70} />
            인챈트 시뮬레이터
          </Link>
        </h1>
        <button type="button" className={styles.sign_in}>
          로그인
        </button>
      </div>
      <nav className={styles.nav}>
        <ul>
          {navigationList.map((item, idx) => (
            <li
              key={idx}
              className={idx > 1 ? styles.sub_nav : styles.main_nav}
            >
              <Link href={item.link}>{item.item}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav className={styles.mobile_nav}>
        <h1 className={styles.title}>
          <Link href={"/"}>
            <Image src={logo} alt="Logo" width={70} />
            인챈트 시뮬레이터
          </Link>
        </h1>
        <CiMenuFries size={25} />
      </nav>
    </header>
  );
};

export default Header;
