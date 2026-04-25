import axios from "axios";

// 등록
export const createNotice = async (title: string, content: string) => {
  const res = await axios.post("/api/admin/notices", {
    title,
    content,
  });

  return res.data;
};

// 수정
export const updateNotice = async (
  id: number,
  title: string,
  content: string
) => {
  const res = await axios.put(`/api/admin/notices/${id}`, {
    title,
    content,
  });

  return res.data;
};

// 삭제
export const deleteNotice = async (id: number) => {
  const res = await axios.delete(`/api/admin/notices/${id}`);
  return res.data;
};