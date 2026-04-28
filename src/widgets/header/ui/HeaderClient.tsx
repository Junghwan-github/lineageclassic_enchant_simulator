"use client";
import styles from "./HeaderClient.module.css";
import Image from "next/image";
import logo from "@/assets/images/lc_logo.png";
import Link from "next/link";
import { AiOutlineNotification } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/features/auth/model/actions";
import { UserType } from "@/shared/types/user";

type HeaderClientProps = {
  session: {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      type?: UserType;
    };
  } | null;
};

const HeaderClient = ({ session }: HeaderClientProps) => {
  const router = useRouter();
  const navigationList = [
    // notice
    { item: "공지", link: "/notice" },
    // feedback
    // { item: "개선제안", link: "/coming-soon" },
    // // about
    // { item: "개발자소개", link: "/coming-soon" },
    // // contact
    // { item: "제작문의", link: "/coming-soon" },
    // // collaboration
    // { item: "협업제안", link: "/coming-soon" },
    // // ads
    // { item: "광고/제휴", link: "/coming-soon" },
    // { item: "관리자", link: "/admin" },
  ];

  const handleSignInPageMove = () => {
    router.push("/auth/signin");
  };

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <h1 className={styles.title}>
          <Link href={"/"}>
            <Image src={logo} alt="Logo" width={70} />
            인챈트 시뮬레이터
          </Link>
        </h1>
        {session?.user ? (
          <button
            type="button"
            className={styles.sign_in}
            onClick={logoutAction}
          >
            로그아웃
          </button>
        ) : (
          <button
            type="button"
            className={styles.sign_in}
            onClick={handleSignInPageMove}
          >
            로그인
          </button>
        )}
      </div>
      <nav className={styles.nav}>
        <ul className={styles.nav_list}>
          {navigationList
            .filter((item) => {
              if (item.item === "관리자") {
                return session?.user?.type === "ADMIN";
              }
              return true;
            })
            .map((item, idx) => (
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
            강화 시뮬레이터
          </Link>
        </h1>
        <Link href={"/notice"}>
          <AiOutlineNotification size={25} />
        </Link>
      </nav>
    </header>
  );
};

export default HeaderClient;
