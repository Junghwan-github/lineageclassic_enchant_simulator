"use client";
import styles from "./NoticeDetail.module.css";
import { useEffect, useState } from "react";
import { Notice } from "@/entities/notice/model/types";
import { getNoticeDetail } from "@/entities/notice/api/get-notices";
import { formatDate } from "@/shared/lib/utils/format";
import { IoEyeOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

type NoticeDetailProps = {
  id: string;
};

const NoticeDetail = ({ id }: NoticeDetailProps) => {
  const [notice, setNotice] = useState<Notice | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNoticeDetail(id);
      setNotice(data);
    };
    fetchData();
  }, [id]);

  if (!notice) {
    return <div>로딩중...</div>;
  }

  return (
    <article className={styles.notice}>
      <header className={styles.header}>
        <h1 className={styles.title}>{notice.title}</h1>
        <div className={styles.authors}>
          <span className={styles.author}>{notice.author}</span>
          <span className={styles.create_at}>
            {formatDate(notice.createdAt)}
          </span>
          <div className={styles.view}>
            <IoEyeOutline size={20} />
            <span>{notice.views}</span>
          </div>
        </div>
      </header>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: notice.content ?? "" }}
      />
      <div className={styles.actions}>
        <button type="button" onClick={() => router.back()}>
          <IoIosArrowBack size={20} />
          뒤로가기
        </button>
      </div>
    </article>
  );
};

export default NoticeDetail;
