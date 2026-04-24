import styles from "./layout.module.css";
import { ReactNode } from "react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import KakaoAd from "@/shared/ui/kakao-ads/kakao";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={styles.main_layout}>
      <aside className={styles.mobile_ads_top}>
        <KakaoAd adUnit="DAN-EEFpAFQ4UE1SdUXx" width={320} height={50} />
      </aside>
      <Header />
      <div className={styles.content_layout}>
        <aside className={styles.pc_ads_left}>
          <KakaoAd adUnit="DAN-h8JSy4SeIkf4m9Q5" width={160} height={600} />
        </aside>
        {children}
        <aside className={styles.pc_ads_right}>
          <KakaoAd adUnit="DAN-OfgM3JJW4LzZJksG" width={160} height={600} />
        </aside>
      </div>
      <Footer />
      <aside className={styles.mobile_ads_bottom}>
        <KakaoAd adUnit="DAN-kB6TpJiKn2L1F2pU" width={320} height={50} />
      </aside>
    </div>
  );
};

export default MainLayout;
