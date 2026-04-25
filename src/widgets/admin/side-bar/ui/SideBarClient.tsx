"use client";
import { SessionType } from "@/shared/types/session";
import styles from "./SideBarClient.module.css";
import PointIcon from "@/shared/ui/PointIcon/PointIcon";
import Link from "next/link";
import { useState } from "react";

const SideBarClient = ({ session }: SessionType) => {
  const [activeValue, setActiveValue] = useState<string>("");

  const handleActiveValue = (value: string) => {
    setActiveValue((prev) => prev === value ? "" : value);
  };

  const adminMenuList = [
    {
      title: "홈",
      value: "dashboard",
      list: [{ item: "대시보드", link: "admin/dashboard" }],
    },
    {
      title: "멤버",
      value: "member",
      list: [{ item: "멤버 관리", link: "admin/member/" }],
    },
    {
      title: "공지/업데이트",
      value: "notice",
      list: [
        { item: "공지 관리", link: "/admin/notice" },
        { item: "공지 등록", link: "/admin/notice/create" },
      ],
    },
    {
      title: "개선제안",
      value: "suggestion",
      list: [{ item: "개선제안 관리", link: "suggestion_list" }],
    },
    {
      title: "컨텐츠",
      value: "content",
      list: [
        { item: "제작문의", link: "contact_create" },
        { item: "협업제안", link: "collab_create" },
        { item: "광고/제휴", link: "ads_partner" },
      ],
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.user_info}>
        {session?.user && (
          <ul>
            <li>{session.user.name}</li>
            <li>{session.user.email}</li>
            <li>
              <span>포인트</span>
              <p>
                {session.user.point}
                <PointIcon width={20} />
              </p>
            </li>
            <li>
              <span>권한</span>
              <p>{session.user.type}</p>
            </li>
          </ul>
        )}
      </div>
      <div className={styles.admin_nav}>
        <ul className={styles.major_list}>
          {adminMenuList.map((list, index) => (
            <li
              key={index}
              className={`${styles.major_item} ${activeValue === list.value ? styles.active : ""}`}
              onClick={() => handleActiveValue(list.value)}
            >
              <p>{list.title}</p>
              <ul className={styles.sub_list}>
                {list.list.map((item, index) => (
                  <li key={index + 1}>
                    <Link href={item.link}>{item.item}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBarClient;
