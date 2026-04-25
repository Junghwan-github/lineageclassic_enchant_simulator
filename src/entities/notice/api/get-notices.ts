import axios from "axios";
import { Notice } from "../model/types";

export type GetNoticesResponse = {
  list: Notice[];
  totalCount: number;
  totalPage: number;
  currentPage: number;
};

export const getNotices = async (
  page: number,
  limit: number,
): Promise<GetNoticesResponse> => {
  const res = await axios.get("/api/admin/notices", {
    params: {
      page,
      limit,
    },
  });

  return res.data.data;
};

export const getNoticeDetail = async (id: string): Promise<Notice> => {
  const res = await axios.get(`/api/admin/notices/${id}`);

  return res.data.data;
};
