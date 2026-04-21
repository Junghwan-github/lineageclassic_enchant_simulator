"use client";

import { useEffect } from "react";

type KakaoAdProps = {
  adUnit: string;
  width: number;
  height: number;
};

const KakaoAd = ({ adUnit, width, height }: KakaoAdProps) => {
  useEffect(() => {
    // 중복 로드 방지
    if (
      !document.querySelector('script[src*="daumcdn.net/kas/static/ba.min.js"]')
    ) {
      const script = document.createElement("script");
      script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "block" }}
      data-ad-unit={adUnit}
      data-ad-width={width}
      data-ad-height={height}
    />
  );
};

export default KakaoAd;
