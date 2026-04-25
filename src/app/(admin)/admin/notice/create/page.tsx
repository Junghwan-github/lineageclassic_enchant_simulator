"use client";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { createNotice } from "@/features/notice/api/notice";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

const NoticeCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
        const res = await createNotice(title, content);

        alert(res.message);

        setTitle("");
        setContent("");
    } catch(err: any) {
        console.error(err);
        if(err.response) {
            alert(err.response.data.message);
        }else{
            alert("공지사항 등록 중 오류가 발생했습니다.");
        }
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h2>공지 등록</h2>
        <div className={styles.content}>
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <ReactQuill
            className={styles.editor}
            theme="snow"
            value={content}
            onChange={setContent}
          />

          <button type="button" onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeCreate;
