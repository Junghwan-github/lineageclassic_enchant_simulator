import styles from "./footer.module.css";
import { FaGithub } from "react-icons/fa";
import { SiNotion } from "react-icons/si";
import { FcLike } from "react-icons/fc";

const Footer = () => {
  const devInfo = [
    {
      item: "Notion",
      icon: SiNotion,
      link: "https://www.notion.so/Dev-Portfolio-331f2bfeb9cc4027b363b2d7251c3356",
    },
    {
      item: "Github",
      icon: FaGithub,
      link: "https://github.com/Junghwan-github",
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.support_info}>
        <p>
          본 페이지가 도움이 되셨거나 마음에 드셨다면, 작은 후원으로
          응원해주시면 큰 힘이 됩니다. <FcLike />
        </p>
        <p>후원 계좌 : 농협 356-1329-3322-13 | 예금주 : 박정환</p>
      </div>
      <div className={styles.content}>
        <div className={styles.dev_info}>
          {/* <h4>개발자 정보</h4> */}
          <ul className={`${styles.list} ${styles.dev_info_list}`}>
            {devInfo.map((item, idx) => {
              const Icon = item.icon;
              return (
                <li key={idx}>
                  <a href={item.link} target="_blank" rel="noreferrer">
                    <Icon size={25} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <nav className={styles.footer_links}>
          <ul className={`${styles.list} ${styles.footer_links_list}`}>
            <li></li>
          </ul>
        </nav>
      </div>

      <div className={styles.copyrights}>
        <p>ⓒ 2026. linrush.kr All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
