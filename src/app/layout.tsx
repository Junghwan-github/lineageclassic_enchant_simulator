import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";


export const metadata: Metadata = {
  title: "리니지 클래식 | 인챈트 시뮬레이터",
  description: "리니지 클래식 무기 및 방어구 인챈트 시뮬레이터",
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
        {children}
        <Footer />
      </body>
    </html>
  );
}
