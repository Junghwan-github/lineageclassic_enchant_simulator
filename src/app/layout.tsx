import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import KakaoAd from "@/shared/ui/kakao-ads/kakao";

export const metadata: Metadata = {
  metadataBase: new URL("https://linrush.kr"),
  title: "리니지 클래식 강화 시뮬레이터 | 인챈트 확률 체험 - Linrush",
  description:
    "리니지 클래식 강화 시뮬레이터. 실제 확률 기반 인챈트 시스템을 바탕으로 무기와 방어구 강화 결과를 미리 체험해볼 수 있습니다. 지르기 전 확률을 확인해보세요.",
  keywords: [
    "리니지 클래식",
    "리니지 클래식 강화",
    "리니지 클래식 인챈트",
    "리니지 클래식 시뮬레이터",
    "강화 시뮬레이터",
    "인챈트 시뮬레이터",
    "강화 확률",
    "인챈트 확률",
    "리니지 러쉬",
    "무기 강화",
    "방어구 강화",
    "Linrush",
  ],
  themeColor: "#000000",
  openGraph: {
    title: "리니지 클래식 강화 시뮬레이터 | Linrush",
    description:
      "오늘도 지르시겠습니까? 지르기 전, 시뮬레이터로 확률을 확인해보세요.",
    url: "https://linrush.kr",
    siteName: "Linrush",
    images: [
      {
        url: "/assets/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "리니지 클래식 강화 시뮬레이터 Linrush",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  other: {
    "naver-site-verification": "25897777ed586c73471f1c3c63291fa3a7429508",
    "google-site-verification": "i0_o_73IC5nqAspm276TLd0H7gs7qfNgH1frTjFUf78",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <div className="content_layout">
          <aside>
            <KakaoAd adUnit="DAN-h8JSy4SeIkf4m9Q5" width={160} height={600} />
          </aside>
          {children}
          <aside>
            <KakaoAd adUnit="DAN-OfgM3JJW4LzZJksG" width={160} height={600} />
          </aside>
        </div>
        <Footer />
      </body>
    </html>
  );
}
