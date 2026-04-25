"use client";
import styles from "./NoticeList.module.css";
import { useEffect, useState } from "react";
import { getNotices } from "@/entities/notice/api/get-notices";
import { Notice } from "@/entities/notice/model/types";
import Link from "next/link";
import { IoEyeOutline } from "react-icons/io5";
import { formatDate } from "@/shared/lib/utils/format";

type NoticeListProps = {
    limit: number;
    theme: "dark" | "light";
}

const NoticeList = ({theme, limit = 15}: NoticeListProps) => {
  const [list, setList] = useState<Notice[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotices(page, limit);
      setList(data.list);
      setTotalPage(data.totalPage);
    };

    fetchData();
  }, [page]);

  return (
    <div className={styles.board_container}>
      <ul className={`${styles.board_list} ${theme === "dark" ? styles.dark : ""}`}>
        {list.map((item) => {
          const createdTime = new Date(item.createdAt).getTime();
          const now = Date.now();

          const isNew = now - createdTime < 1000 * 60 * 60 * 24;

          return (
            <li key={item.id}>
              <div className={styles.board}>
                <div className={`${styles.title} ${theme === "dark" ? styles.dark : ""}`}>
                  <Link href={`${theme === "light" ? "/admin" : ""}/notice/${item.id}`}>{item.title}</Link>
                  {isNew && <span>N</span>}
                </div>

                <div className={styles.board_meta}>
                  <div className={`${styles.authors} ${theme === "dark" ? styles.dark : ""}`}>
                    <span className={`${styles.author} ${theme === "dark" ? styles.dark : ""}`}>{item.author}</span>
                    <span className={`${styles.create_at} ${theme === "dark" ? styles.dark : ""}`}>
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div className={`${styles.view} ${theme === "dark" ? styles.dark : ""}`}>
                    <IoEyeOutline size={20} />
                    <span>{item.views}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={`${styles.pagination} ${theme === "dark" ? styles.dark : ""}`}>
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          이전
        </button>

        {Array.from({ length: totalPage }, (_, idx) => {
          const pageNumber = idx + 1;

          return (
            <button
              key={pageNumber}
              type="button"
              disabled={page === pageNumber}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          type="button"
          disabled={page === totalPage}
          onClick={() => setPage((prev) => prev + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default NoticeList;
