import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
    {
      url: "https://linrush.kr",
      lastModified: new Date(),
    },
    {
      url: "https://linrush.kr/notice",
      lastModified: new Date(),
    },
    {
      url: "https://linrush.kr/feedback",
      lastModified: new Date(),
    },
    {
      url: "https://linrush.kr/about",
      lastModified: new Date(),
    },
    {
      url: "https://linrush.kr/contact",
      lastModified: new Date(),
    },
    {
      url: "https://linrush.kr/collaboration",
      lastModified: new Date(),
    },
    {
      url: "https://linrush.kr/ads",
      lastModified: new Date(),
    },
  ];
}